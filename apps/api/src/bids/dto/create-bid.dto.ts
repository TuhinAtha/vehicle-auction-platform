import type { CreateBidInput } from '@repo/shared'
import { IsInt, Min } from 'class-validator'

export class CreateBidDto implements CreateBidInput {
  /** Whole currency units */
  @IsInt()
  @Min(1)
  amount: number
}
