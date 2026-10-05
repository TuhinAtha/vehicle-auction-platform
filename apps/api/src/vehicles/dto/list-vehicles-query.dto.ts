import { VEHICLE_AVAILABILITIES, type VehicleAvailability } from '@repo/shared'
import { Type } from 'class-transformer'
import { IsIn, IsInt, IsOptional, Min } from 'class-validator'

export class ListVehiclesQueryDto {
  @IsIn(VEHICLE_AVAILABILITIES)
  availability: VehicleAvailability

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
