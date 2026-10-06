import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { VEHICLE_PHOTOS_PATH } from '@repo/shared'
import { Role } from '../auth/decorators.js'
import { VehiclesService } from './vehicles.service.js'
import { CreateVehicleDto } from './dto/create-vehicle.dto.js'
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto.js'
import { vehiclePhotoUpload } from './vehicle-photo-upload.js'

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @Role('ADMIN')
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto)
  }

  @Post('photos')
  @Role('ADMIN')
  @UseInterceptors(FileInterceptor('photo', vehiclePhotoUpload))
  uploadPhoto(@UploadedFile() photo?: Express.Multer.File) {
    if (!photo) throw new BadRequestException('photo is required')
    return { path: `${VEHICLE_PHOTOS_PATH}/${photo.filename}` }
  }

  @Get()
  @Role('ADMIN')
  findAll(@Query() { availability, limit }: ListVehiclesQueryDto) {
    return this.vehiclesService.findAll(availability, limit)
  }

  @Get('counts')
  @Role('ADMIN')
  countByAvailability() {
    return this.vehiclesService.countByAvailability()
  }

  @Get(':id')
  @Role('ADMIN')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.findOne(id)
  }
}
