import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  VEHICLE_AVAILABILITIES,
  type VehicleAvailability,
  type VehicleAvailabilityCounts,
} from '@repo/shared'
import { countBy, groupBy, omit } from 'es-toolkit'
import { type FindOptionsWhere, Repository } from 'typeorm'
import { Auction } from '../auctions/entities/auction.entity.js'
import { WINNING_BID_ORDER } from '../bids/bid.constant.js'
import { isPgError, PgErrorCode } from '../common/utils/pg.util.js'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'
import { Vehicle } from './entities/vehicle.entity.js'

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicles: Repository<Vehicle>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    return this.save(this.vehicles.create(createVehicleDto))
  }

  async findAll(availability: VehicleAvailability, limit?: number) {
    const vehicles = await this.findAllWithAuctions()
    return vehicles
      .filter((vehicle) => vehicle.availability === availability)
      .slice(0, limit)
      .map((vehicle) => ({
        ...omit(vehicle, ['availability', 'auctions']),
        auction: this.getMainAuction(vehicle.auctions),
      }))
  }

  async countByAvailability(): Promise<VehicleAvailabilityCounts> {
    const counts = countBy(
      await this.findAllWithAuctions(),
      ({ availability }) => availability,
    )
    return Object.fromEntries(
      VEHICLE_AVAILABILITIES.map((availability) => [
        availability,
        counts[availability] ?? 0,
      ]),
    ) as VehicleAvailabilityCounts
  }

  async findOne(id: string) {
    const vehicle = await this.vehicles.findOneBy({ id })
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`)
    return this.withAuctions(
      vehicle,
      await this.findAuctions({ vehicleId: id }),
    )
  }

  private async findAllWithAuctions() {
    const [vehicles, auctions] = await Promise.all([
      this.vehicles.find({ order: { createdAt: 'DESC' } }),
      this.findAuctions(),
    ])
    const auctionsByVehicle = groupBy(auctions, ({ vehicleId }) => vehicleId)

    return vehicles.map((vehicle) =>
      this.withAuctions(vehicle, auctionsByVehicle[vehicle.id] ?? []),
    )
  }

  private findAuctions(where?: FindOptionsWhere<Auction>) {
    return this.vehicles.manager.find(Auction, {
      where,
      relations: { bids: { dealer: true } },
      order: { endsAt: 'DESC', bids: WINNING_BID_ORDER },
    })
  }

  private withAuctions(vehicle: Vehicle, auctions: Auction[]) {
    return {
      ...vehicle,
      availability: this.getAvailability(auctions),
      auctions: auctions.map(({ bids, ...auction }) => ({
        ...auction,
        highestBid: bids.at(0) ?? null,
      })),
    }
  }

  private getAvailability(auctions: Auction[]): VehicleAvailability {
    if (auctions.some(({ result }) => result === 'SOLD')) return 'SOLD'
    if (auctions.some(({ result }) => result === null)) return 'IN_AUCTION'
    return 'AVAILABLE'
  }

  private getMainAuction<T extends Pick<Auction, 'result'>>(auctions: T[]) {
    return (
      auctions.find(({ result }) => result === 'SOLD') ??
      auctions.find(({ result }) => result === null) ??
      auctions.at(0)
    )
  }

  private async save(vehicle: Vehicle) {
    try {
      return await this.vehicles.save(vehicle)
    } catch (error) {
      if (isPgError(error, PgErrorCode.UniqueViolation)) {
        throw new ConflictException(
          `A vehicle with VIN ${vehicle.vin} already exists`,
        )
      }
      throw error
    }
  }
}
