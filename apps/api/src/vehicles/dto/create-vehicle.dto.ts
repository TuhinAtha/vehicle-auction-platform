import type { CreateVehicleInput } from '@repo/types'
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'

export class CreateVehicleDto implements CreateVehicleInput {
  /** 17 characters; I, O and Q are not allowed */
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'vin must be 17 characters (A-Z, 0-9, excluding I, O, Q)',
  })
  vin: string

  @IsString()
  @IsNotEmpty()
  make: string

  @IsString()
  @IsNotEmpty()
  model: string

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number

  @IsInt()
  @Min(0)
  mileage: number

  @IsNumber()
  @IsPositive()
  batteryCapacityKwh: number

  @IsNumber()
  @Min(0)
  @Max(100)
  batterySohPercent: number

  @IsNumber()
  @Min(0)
  rangeKm: number

  /** YYYY-MM-DD */
  @IsDateString({ strict: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'registrationDate must be in YYYY-MM-DD format',
  })
  registrationDate: string

  @ValidateIf((_, value) => value !== null)
  @IsString()
  condition: string | null

  @IsArray()
  @IsUrl({}, { each: true })
  photos: string[]

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  country: string
}
