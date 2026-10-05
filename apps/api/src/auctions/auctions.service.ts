import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import {
  AUCTION_PHASES,
  type AuctionPhase,
  type AuctionPhaseCounts,
  BID_STATUSES,
  type BidStatus,
  type BidStatusCounts,
  DEALER_AUCTION_EXCLUDED_FIELDS,
  DEALER_AUCTION_PHASES,
  type JwtPayload,
  type UserRole,
} from '@repo/shared'
import { countBy, groupBy, maxBy, omit } from 'es-toolkit'
import {
  type FindOptionsSelect,
  type FindOptionsWhere,
  In,
  IsNull,
  LessThanOrEqual,
  Not,
  Repository,
} from 'typeorm'
import { Bid } from '../bids/entities/bid.entity.js'
import { VehiclesService } from '../vehicles/vehicles.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { Auction } from './entities/auction.entity.js'

const DEALER_HIDDEN = new Set<string>(DEALER_AUCTION_EXCLUDED_FIELDS)
const DEALER_PHASES = new Set<AuctionPhase>(DEALER_AUCTION_PHASES)
/** The highest bid wins; on a tie, the earlier one. */
const WINNING_BID_ORDER = { amount: 'DESC', createdAt: 'ASC' } as const
const STATUS_SYNC_INTERVAL_MS = 10_000

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctions: Repository<Auction>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(createAuctionDto: CreateAuctionDto) {
    const { startsAt, endsAt, ...rest } = createAuctionDto
    await this.vehiclesService.findOne(rest.vehicleId)

    const auction = this.auctions.create({
      ...rest,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
    })
    assertValidWindow(auction)
    return this.auctions.save(auction)
  }

  /**
   * Auctions go LIVE at startsAt and ENDED at endsAt. Ending runs first, so an
   * auction past both times never turns LIVE.
   */
  @Interval(STATUS_SYNC_INTERVAL_MS)
  async syncStatuses() {
    const now = new Date()
    await this.auctions.update(
      { status: Not('ENDED'), endsAt: LessThanOrEqual(now) },
      { status: 'ENDED' },
    )
    await this.auctions.update(
      { status: 'SCHEDULED', startsAt: LessThanOrEqual(now) },
      { status: 'LIVE' },
    )
  }

  async findAll(viewer: JwtPayload, phase: AuctionPhase) {
    const auctions = await this.auctions.find({
      select: this.selectFor(viewer.role),
      where: await this.getClauseForPhase(viewer, phase),
      relations: { vehicle: true },
      order: phase === 'LIVE' ? { endsAt: 'ASC' } : { startsAt: 'ASC' },
    })
    if (viewer.role === 'DEALER') return auctions

    const bids = await this.auctions.manager.find(Bid, {
      where: { auctionId: In(auctions.map(({ id }) => id)) },
    })
    const bidsByAuction = groupBy(bids, (bid) => bid.auctionId)

    return auctions.map((auction) => {
      const auctionBids = bidsByAuction[auction.id] ?? []
      return {
        ...auction,
        bidCount: auctionBids.length,
        maxBidAmount: maxBy(auctionBids, (bid) => bid.amount)?.amount ?? null,
      }
    })
  }

  /** The full auction: admins get every bid, dealers their own highest one. */
  async findOneFor(id: string, viewer: JwtPayload) {
    const isAdmin = viewer.role === 'ADMIN'
    const auction = await this.auctions.findOne({
      select: this.selectFor(viewer.role),
      where: { id },
      relations: { vehicle: true, bids: isAdmin ? { dealer: true } : false },
      order: isAdmin ? { bids: WINNING_BID_ORDER } : undefined,
    })
    if (!auction) throw new NotFoundException(`Auction ${id} not found`)
    if (isAdmin) {
      const highestBid = auction.bids.at(0)
      return {
        ...auction,
        potentialWinningBid:
          highestBid && highestBid.amount >= auction.reservePrice
            ? highestBid
            : null,
      }
    }

    const myBid = await this.auctions.manager.findOne(Bid, {
      where: { auctionId: id, dealerId: viewer.sub },
      order: { amount: 'DESC' },
    })
    const { result, winningBid } = await this.auctions.findOneOrFail({
      select: { id: true, result: true },
      where: { id },
      relations: { winningBid: true },
    })
    return {
      ...auction,
      myBid,
      bidStatus: myBid
        ? getBidStatus(
            { status: auction.status, result },
            winningBid?.dealerId === viewer.sub,
          )
        : null,
    }
  }

  async findMyBid(id: string, dealer: JwtPayload) {
    const auction = await this.findOneFor(id, dealer)
    if (!('bidStatus' in auction) || auction.bidStatus === null) {
      throw new NotFoundException(`No bid on auction ${id}`)
    }
    return auction
  }

  /**
   * The highest bid wins if it reaches the reserve; on a tie, the earlier one.
   */
  async confirmSold(id: string) {
    const auction = await this.findPending(id)
    const winningBid = await this.auctions.manager.findOne(Bid, {
      where: { auctionId: id },
      order: WINNING_BID_ORDER,
    })
    if (!winningBid) throw new ConflictException(`Auction ${id} has no bids`)
    if (winningBid.amount < auction.reservePrice)
      throw new ConflictException(`Highest bid is below the reserve price`)

    await this.auctions.update(id, {
      result: 'SOLD',
      winningBidId: winningBid.id,
    })
    return this.findOne(id)
  }

  async markUnsold(id: string) {
    await this.findPending(id)
    await this.auctions.update(id, { result: 'UNSOLD' })
    return this.findOne(id)
  }

  private async findPending(id: string) {
    const auction = await this.findOne(id)
    if (auction.status !== 'ENDED' || auction.result !== null) {
      throw new ConflictException(`Auction ${id} is not awaiting a result`)
    }
    return auction
  }

  /** Number of auctions in each phase the viewer can see. */
  async countByPhase(viewer: JwtPayload): Promise<AuctionPhaseCounts> {
    const phases =
      viewer.role === 'DEALER' ? DEALER_AUCTION_PHASES : AUCTION_PHASES
    const counts = await Promise.all(
      phases.map(async (phase) =>
        this.auctions.count({
          where: await this.getClauseForPhase(viewer, phase),
        }),
      ),
    )
    return Object.fromEntries(phases.map((phase, i) => [phase, counts[i]]))
  }

  async findMyBids(dealerId: string, phase?: BidStatus) {
    const myBids = await this.loadMyBids(dealerId)
    return phase
      ? myBids.filter(({ bidStatus }) => bidStatus === phase)
      : myBids
  }

  async countMyBids(dealerId: string): Promise<BidStatusCounts> {
    const myBids = await this.loadMyBids(dealerId)
    const counts = countBy(myBids, ({ bidStatus }) => bidStatus)
    return Object.fromEntries(
      BID_STATUSES.map((status) => [status, counts[status] ?? 0]),
    ) as BidStatusCounts
  }

  private async loadMyBids(dealerId: string) {
    const auctions = await this.auctions.find({
      where: { bids: { dealerId } },
      relations: { vehicle: true, winningBid: true, bids: true },
      order: { endsAt: 'ASC' },
    })

    return auctions.map(({ winningBid, bids, ...auction }) => ({
      ...omit(auction, DEALER_AUCTION_EXCLUDED_FIELDS),
      myBidAmount: Math.max(...bids.map((bid) => bid.amount)),
      bidStatus: getBidStatus(auction, winningBid?.dealerId === dealerId),
    }))
  }

  /**
   * Status/result filter for a phase; dealers only get their phases.
   * For a dealer, LIVE leaves out the auctions they already bid on: those are
   * their ACTIVE bids.
   */
  private async getClauseForPhase(
    { role, sub }: JwtPayload,
    phase: AuctionPhase,
  ): Promise<FindOptionsWhere<Auction>> {
    if (role === 'DEALER' && !DEALER_PHASES.has(phase)) {
      throw new BadRequestException(`phase is not allowed for dealer`)
    }

    switch (phase) {
      case 'SCHEDULED':
        return { status: phase }
      case 'LIVE': {
        if (role === 'ADMIN') return { status: phase }

        const myBids = await this.auctions.manager.find(Bid, {
          select: { auctionId: true },
          where: { dealerId: sub },
        })
        return {
          status: phase,
          id: Not(In(myBids.map(({ auctionId }) => auctionId))),
        }
      }
      case 'PENDING':
        return { status: 'ENDED', result: IsNull() }
    }
  }

  async findOne(id: string) {
    const auction = await this.auctions.findOne({
      where: { id },
      relations: { vehicle: true },
    })
    if (!auction) throw new NotFoundException(`Auction ${id} not found`)
    return auction
  }

  private selectFor(role: UserRole): FindOptionsSelect<Auction> | undefined {
    if (role === 'ADMIN') return undefined
    return Object.fromEntries(
      this.auctions.metadata.columns
        .map(({ propertyName }) => propertyName)
        .filter((name) => !DEALER_HIDDEN.has(name))
        .map((name) => [name, true]),
    )
  }
}

function getBidStatus(
  { status, result }: Pick<Auction, 'status' | 'result'>,
  isWinner: boolean,
): BidStatus {
  if (status !== 'ENDED') return 'ACTIVE'
  if (result === null) return 'PENDING'
  return isWinner ? 'WON' : 'NOT_WON'
}

function assertValidWindow({ startsAt, endsAt }: Auction) {
  if (endsAt <= startsAt) {
    throw new BadRequestException('endsAt must be after startsAt')
  }
}
