import {
  Controller,
  Get,
  Post,
  Body,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { Role } from '../auth/decorators.js'
import { VehiclesService } from './vehicles.service.js'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Role('ADMIN')
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto)
  }

  @Get()
  @Role('ADMIN')
  findAll() {
    return this.vehiclesService.findAll()
  }

  @Get('available')
  @Role('ADMIN')
  findAvailable(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.vehiclesService.findAvailable(limit)
  }
}
