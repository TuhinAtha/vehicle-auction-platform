import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  type AdminAuctionListItem,
  AUCTION_PHASES,
  type AuctionPhase,
  type AuctionPhaseCounts,
  DEALER_AUCTION_EXCLUDED_FIELDS,
  DEALER_AUCTION_PHASES,
  type DealerAuctionListItem,
  type DealerAuctionPhase,
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

  async findAll(
    role: UserRole,
    phase?: AuctionPhase | DealerAuctionPhase,
  ): Promise<
    AdminAuctionListItem<Auction>[] | DealerAuctionListItem<Auction>[]
  > {
    const auctions = await this.auctions.find({
      select: this.selectFor(role),
      where: this.getClauseForPhase(role, phase),
      relations: { vehicle: true },
      order: { startsAt: 'ASC' },
    })

    if (role !== 'ADMIN') return auctions

    const bidCounts = await this.countBids(auctions.map(({ id }) => id))
    return auctions.map((auction) => ({
      ...auction,
      bidCount: bidCounts.get(auction.id) ?? 0,
    }))
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

  /** Bid count per auction, in one grouped query. */
  private async countBids(auctionIds: string[]) {
    if (auctionIds.length === 0) return new Map<string, number>()

    const rows = await this.auctions.manager
      .createQueryBuilder(Bid, 'bid')
      .select('bid.auctionId', 'auctionId')
      .addSelect('COUNT(*)::int', 'count')
      .where('bid.auctionId IN (:...auctionIds)', { auctionIds })
      .groupBy('bid.auctionId')
      .getRawMany<{ auctionId: string; count: number }>()

    return new Map(rows.map(({ auctionId, count }) => [auctionId, count]))
  }

  async findOne(id: string, viewerRole?: UserRole) {
    const auction = await this.auctions.findOne({
      select: this.selectFor(viewerRole),
      where: { id },
      relations: { vehicle: true },
    })
    if (!auction) throw new NotFoundException(`Auction ${id} not found`)
    return auction
  }

  private selectFor(role?: UserRole): FindOptionsSelect<Auction> | undefined {
    if (role === undefined || role === 'ADMIN') return undefined
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
