import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Auction } from '../auctions/entities/auction.entity.js'
import { isPgError, PgErrorCode } from '../common/utils/pg.util.js'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js'
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

  findAvailable(limit?: number) {
    return this.vehicles
      .createQueryBuilder('vehicle')
      .where((qb) => {
        const activeAuction = qb
          .subQuery()
          .select('1')
          .from(Auction, 'auction')
          .where('auction.vehicleId = vehicle.id')
          .andWhere('auction.status IN (:...statuses)')
          .getQuery()
        return `NOT EXISTS ${activeAuction}`
      })
      .setParameter('statuses', ['SCHEDULED', 'LIVE'])
      .orderBy('vehicle.createdAt', 'DESC')
      .take(limit)
      .getMany()
  }

  async findOne(id: string) {
    const vehicle = await this.vehicles.findOneBy({ id })
    if (!vehicle) throw new NotFoundException(`Vehicle ${id} not found`)
    return vehicle
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.findOne(id)
    return this.save(this.vehicles.merge(vehicle, updateVehicleDto))
  }

  async remove(id: string) {
    try {
      const { affected } = await this.vehicles.delete({ id })
      if (!affected) throw new NotFoundException(`Vehicle ${id} not found`)
    } catch (error) {
      if (isPgError(error, PgErrorCode.ForeignKeyViolation)) {
        throw new ConflictException(
          `Vehicle ${id} has auctions and cannot be deleted`,
        )
      }
      throw error
    }
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
