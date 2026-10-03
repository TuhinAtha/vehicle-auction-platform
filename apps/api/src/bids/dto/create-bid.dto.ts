import type { CreateBidInput } from '@repo/shared'
import { IsInt, IsUUID, Min } from 'class-validator'

export class CreateBidDto implements CreateBidInput {
  @IsUUID()
  dealerId: string

  /** Whole currency units */
  @IsInt()
  @Min(1)
  amount: number
}
