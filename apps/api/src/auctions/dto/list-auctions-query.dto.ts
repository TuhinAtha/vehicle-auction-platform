import { AUCTION_PHASES, type AuctionPhase } from '@repo/shared'
import { IsIn } from 'class-validator'

export class ListAuctionsQueryDto {
  @IsIn(AUCTION_PHASES)
  phase: AuctionPhase
}
