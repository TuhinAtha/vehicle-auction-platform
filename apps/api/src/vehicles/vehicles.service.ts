import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryFailedError, Repository } from 'typeorm'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js'
import { Vehicle } from './entities/vehicle.entity.js'

const PG_UNIQUE_VIOLATION = '23505'

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
    const { affected } = await this.vehicles.delete({ id })
    if (!affected) throw new NotFoundException(`Vehicle ${id} not found`)
  }

  private async save(vehicle: Vehicle) {
    try {
      return await this.vehicles.save(vehicle)
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `A vehicle with VIN ${vehicle.vin} already exists`,
        )
      }
      throw error
    }
  }
}
