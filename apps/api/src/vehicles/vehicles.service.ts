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
import { In, IsNull, Not, Repository } from 'typeorm'
import { Auction } from '../auctions/entities/auction.entity.js'
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

  findAll(availability: VehicleAvailability, limit?: number) {
    switch (availability) {
      case 'UNLISTED':
        return this.findUnlisted(limit)
      case 'SOLD':
        return this.findSold(limit)
      case 'UNSOLD':
        return this.findUnsold(limit)
    }
  }

  // Never been in an auction
  private async findUnlisted(limit?: number) {
    const auctions = await this.vehicles.manager.find(Auction, {
      select: { vehicleId: true },
    })

    return this.vehicles.find({
      where: { id: Not(In(auctions.map(({ vehicleId }) => vehicleId))) },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  private async findSold(limit?: number) {
    const auctions = await this.vehicles.manager.find(Auction, {
      select: { vehicleId: true },
      where: { result: 'SOLD' },
    })

    return this.vehicles.find({
      where: { id: In(auctions.map(({ vehicleId }) => vehicleId)) },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  // Every auction ended UNSOLD: none open, none sold
  private async findUnsold(limit?: number) {
    const unsoldAuctions = await this.vehicles.manager.find(Auction, {
      select: { vehicleId: true },
      where: { result: 'UNSOLD' },
    })
    const otherAuctions = await this.vehicles.manager.find(Auction, {
      select: { vehicleId: true },
      where: [{ result: IsNull() }, { result: 'SOLD' }],
    })
    const otherIds = new Set(otherAuctions.map(({ vehicleId }) => vehicleId))
    const unsoldIds = unsoldAuctions
      .map(({ vehicleId }) => vehicleId)
      .filter((id) => !otherIds.has(id))

    return this.vehicles.find({
      where: { id: In(unsoldIds) },
      order: { createdAt: 'DESC' },
      take: limit,
    })
  }

  async countByAvailability(): Promise<VehicleAvailabilityCounts> {
    const lists = await Promise.all(
      VEHICLE_AVAILABILITIES.map((availability) => this.findAll(availability)),
    )
    return Object.fromEntries(
      VEHICLE_AVAILABILITIES.map((availability, i) => [
        availability,
        lists[i].length,
      ]),
    ) as VehicleAvailabilityCounts
  }

  async findOne(id: string) {
    const vehicle = await this.vehicles.findOneBy({ id })
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`)
    return vehicle
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
