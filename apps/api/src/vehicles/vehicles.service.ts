import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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

  findAll() {
    return this.vehicles.find({ order: { createdAt: 'DESC' } })
  }

  async findAvailable(limit?: number) {
    const auctionsWithoutResult = await this.vehicles.manager.find(Auction, {
      select: { vehicleId: true },
      where: { result: IsNull() },
    })

    return this.vehicles.find({
      where: {
        id: Not(In(auctionsWithoutResult.map(({ vehicleId }) => vehicleId))),
      },
      order: { createdAt: 'DESC' },
      take: limit,
    })
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
