import { AUCTION_PHASES, type AuctionPhase } from '@repo/shared'
import { IsIn, IsOptional } from 'class-validator'

export class ListAuctionsQueryDto {
  /** Only return auctions with this status */
  @IsOptional()
  @IsIn(AUCTION_PHASES)
  phase?: AuctionPhase
}
