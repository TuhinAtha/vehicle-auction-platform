import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { VehiclesService } from '../vehicles/vehicles.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { UpdateAuctionDto } from './dto/update-auction.dto.js'
import { Auction } from './entities/auction.entity.js'

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

  findAll() {
    return this.auctions.find({
      relations: { vehicle: true },
      order: { startsAt: 'ASC' },
    })
  }

  async findOne(id: string) {
    const auction = await this.auctions.findOne({
      where: { id },
      relations: { vehicle: true },
    })
    if (!auction) throw new NotFoundException(`Auction ${id} not found`)
    return auction
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

  async remove(id: string) {
    await this.findScheduled(id)
    await this.auctions.delete({ id })
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
