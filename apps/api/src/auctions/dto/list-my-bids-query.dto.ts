import { BID_STATUSES, type BidStatus } from '@repo/shared'
import { IsIn, IsOptional } from 'class-validator'

export class ListMyBidsQueryDto {
  @IsOptional()
  @IsIn(BID_STATUSES)
  phase?: BidStatus
}
