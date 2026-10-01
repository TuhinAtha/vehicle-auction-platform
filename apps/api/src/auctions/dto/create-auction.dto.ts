import type { CreateAuctionInput } from '@repo/types'
import { IsDateString, IsInt, IsUUID, Min } from 'class-validator'

export class CreateAuctionDto implements CreateAuctionInput {
  @IsUUID()
  vehicleId: string

  /** ISO 8601 */
  @IsDateString({ strict: true })
  startsAt: string

  /** ISO 8601, must be after startsAt */
  @IsDateString({ strict: true })
  endsAt: string

  /** Whole currency units */
  @IsInt()
  @Min(0)
  reservePrice: number

  /** Whole currency units */
  @IsInt()
  @Min(1)
  minIncrement: number
}
