import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  AUCTION_PHASES,
  type AuctionPhase,
  type AuctionPhaseCounts,
  BID_STATUSES,
  type BidStatus,
  type BidStatusCounts,
  DEALER_AUCTION_EXCLUDED_FIELDS,
  type DealerAuctionExcludedField,
  DEALER_AUCTION_PHASES,
  type DealerAuctionPhase,
  type JwtPayload,
  type UserRole,
} from '@repo/shared'
import {
  type FindOptionsSelect,
  type FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm'
import { Bid } from '../bids/entities/bid.entity.js'
import { VehiclesService } from '../vehicles/vehicles.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { Auction } from './entities/auction.entity.js'

const DEALER_HIDDEN = new Set<string>(DEALER_AUCTION_EXCLUDED_FIELDS)
const DEALER_PHASES = new Set<AuctionPhase>(DEALER_AUCTION_PHASES)

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

  async findAll(viewer: JwtPayload, phase?: AuctionPhase | DealerAuctionPhase) {
    const auctions = await this.auctions.find({
      select: this.selectFor(viewer.role),
      where: this.getClauseForPhase(viewer.role, phase),
      relations: { vehicle: true },
      order: { startsAt: 'ASC' },
    })

    const bids = await this.auctions.manager.find(Bid, {
      where: {
        auctionId: In(auctions.map(({ id }) => id)),
        ...(viewer.role === 'DEALER' && { dealerId: viewer.sub }),
      },
    })
    const amountsOf = (auctionId: string) =>
      bids.filter((bid) => bid.auctionId === auctionId).map((bid) => bid.amount)

    if (viewer.role === 'ADMIN') {
      return auctions.map((auction) => {
        const amounts = amountsOf(auction.id)
        return {
          ...auction,
          bidCount: amounts.length,
          maxBidAmount: amounts.length ? Math.max(...amounts) : null,
        }
      })
    }

    return auctions.map((auction) => {
      const amounts = amountsOf(auction.id)
      return {
        ...auction,
        myBidAmount: amounts.length ? Math.max(...amounts) : null,
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
      order: isAdmin ? { bids: { createdAt: 'DESC' } } : undefined,
    })
    if (!auction) throw new NotFoundException(`Auction ${id} not found`)
    if (isAdmin) return auction

    const myBid = await this.auctions.manager.findOne(Bid, {
      where: { auctionId: id, dealerId: viewer.sub },
      order: { amount: 'DESC' },
    })
    return { ...auction, myBid }
  }

  /** Number of auctions in each phase the role can see. */
  async countByPhase(role: UserRole): Promise<AuctionPhaseCounts> {
    const phases = role === 'DEALER' ? DEALER_AUCTION_PHASES : AUCTION_PHASES
    const counts = await Promise.all(
      phases.map((phase) =>
        this.auctions.count({ where: this.getClauseForPhase(role, phase) }),
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
    const counts = Object.fromEntries(
      BID_STATUSES.map((status) => [status, 0]),
    ) as BidStatusCounts
    for (const { bidStatus } of myBids) counts[bidStatus] += 1
    return counts
  }

  private async loadMyBids(dealerId: string) {
    const auctions = await this.auctions.find({
      where: { bids: { dealerId } },
      relations: { vehicle: true, winningBid: true, bids: true },
      order: { endsAt: 'DESC' },
    })

    return auctions.map(({ winningBid, bids, ...auction }) => ({
      ...omitDealerHidden(auction),
      myBidAmount: Math.max(...bids.map((bid) => bid.amount)),
      bidStatus: getBidStatus(auction, winningBid?.dealerId === dealerId),
    }))
  }

  /** Status/result filter for a phase; dealers only get their phases. */
  private getClauseForPhase(
    role: UserRole,
    phase?: AuctionPhase | DealerAuctionPhase,
  ): FindOptionsWhere<Auction> {
    if (role === 'DEALER') {
      if (!phase) return { status: In(DEALER_AUCTION_PHASES) }
      if (!DEALER_PHASES.has(phase)) {
        throw new BadRequestException(`phase is not allowed for dealer`)
      }
    }

    switch (phase) {
      case undefined:
        return {}
      case 'SCHEDULED':
      case 'LIVE':
        return { status: phase }
      case 'COMPLETED':
        return { status: 'ENDED', result: Not(IsNull()) }
      case 'REVIEW':
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

function omitDealerHidden(auction: Omit<Auction, 'winningBid' | 'bids'>) {
  return Object.fromEntries(
    Object.entries(auction).filter(([key]) => !DEALER_HIDDEN.has(key)),
  ) as Omit<typeof auction, DealerAuctionExcludedField>
}

function getBidStatus(
  { status, result }: Pick<Auction, 'status' | 'result'>,
  isWinner: boolean,
): BidStatus {
  if (status !== 'ENDED') return 'ACTIVE'
  if (result === null) return 'AWAITING_RESULT'
  return isWinner ? 'WON' : 'NOT_WON'
}

function assertValidWindow({ startsAt, endsAt }: Auction) {
  if (endsAt <= startsAt) {
    throw new BadRequestException('endsAt must be after startsAt')
  }
}
