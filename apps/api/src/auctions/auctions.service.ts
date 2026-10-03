import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  AUCTION_PHASES,
  type AuctionPhase,
  type AuctionPhaseCounts,
  DEALER_AUCTION_EXCLUDED_FIELDS,
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
import { UpdateAuctionDto } from './dto/update-auction.dto.js'
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
    const auctionIds = auctions.map(({ id }) => id)

    if (viewer.role === 'ADMIN') {
      const bids = await this.summariseBids(auctionIds)
      return auctions.map((auction) => ({
        ...auction,
        bidCount: bids.get(auction.id)?.count ?? 0,
        maxBidAmount: bids.get(auction.id)?.max ?? null,
      }))
    }

    const ownBids = await this.summariseBids(auctionIds, viewer.sub)
    return auctions.map((auction) => ({
      ...auction,
      myBidAmount: ownBids.get(auction.id)?.max ?? null,
    }))
  }

  /** The full auction: admins get every bid, dealers their own highest one. */
  async findOneFor(id: string, viewer: JwtPayload) {
    const isAdmin = viewer.role === 'ADMIN'
    const auction = await this.auctions.findOne({
      select: this.selectFor(viewer.role),
      where: { id },
      relations: { vehicle: true, bids: isAdmin },
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

  private async summariseBids(auctionIds: string[], dealerId?: string) {
    if (auctionIds.length === 0) {
      return new Map<string, { count: number; max: number }>()
    }

    const query = this.auctions.manager
      .createQueryBuilder(Bid, 'bid')
      .select('bid.auctionId', 'auctionId')
      .addSelect('COUNT(*)::int', 'count')
      .addSelect('MAX(bid.amount)', 'max')
      .where('bid.auctionId IN (:...auctionIds)', { auctionIds })
      .groupBy('bid.auctionId')
    if (dealerId) query.andWhere('bid.dealerId = :dealerId', { dealerId })

    const rows = await query.getRawMany<{
      auctionId: string
      count: number
      max: number
    }>()
    return new Map(
      rows.map(({ auctionId, ...summary }) => [auctionId, summary]),
    )
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

  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    const auction = await this.findScheduled(id)
    const { startsAt, endsAt, ...rest } = updateAuctionDto

    if (rest.vehicleId && rest.vehicleId !== auction.vehicleId) {
      auction.vehicle = await this.vehiclesService.findOne(rest.vehicleId)
    }
    this.auctions.merge(auction, rest)
    if (startsAt) auction.startsAt = new Date(startsAt)
    if (endsAt) auction.endsAt = new Date(endsAt)

    assertValidWindow(auction)
    return this.auctions.save(auction)
  }

  private async findScheduled(id: string) {
    const auction = await this.findOne(id)
    if (auction.status !== 'SCHEDULED') {
      throw new ConflictException(
        `Auction ${id} is ${auction.status}; only SCHEDULED auctions can be changed`,
      )
    }
    return auction
  }
}

function assertValidWindow({ startsAt, endsAt }: Auction) {
  if (endsAt <= startsAt) {
    throw new BadRequestException('endsAt must be after startsAt')
  }
}
