import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import { Role } from '../auth/decorators.js'
import { VehiclesService } from './vehicles.service.js'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'
import { UpdateVehicleDto } from './dto/update-vehicle.dto.js'

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

  @Get(':id')
  @Role('ADMIN')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findOne(id)
  }

  @Patch(':id')
  @Role('ADMIN')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto)
  }

  @Delete(':id')
  @Role('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.remove(id)
  }
}
