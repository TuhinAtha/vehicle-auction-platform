import type {
  AUCTION_PHASES,
  AUCTION_RESULTS,
  AUCTION_STATUSES,
  DEALER_AUCTION_EXCLUDED_FIELDS,
  DEALER_AUCTION_PHASES,
} from '../constants/auction.constant'
import type { Auction } from '../interfaces/auction.interface'

export type AuctionStatus = (typeof AUCTION_STATUSES)[number]

export type AuctionResult = (typeof AUCTION_RESULTS)[number]

export type AuctionPhase = (typeof AUCTION_PHASES)[number]

export type DealerAuctionPhase = (typeof DEALER_AUCTION_PHASES)[number]

/** GET /auctions/counts: only the phases the caller can see are present. */
export type AuctionPhaseCounts = Partial<Record<AuctionPhase, number>>

export type DealerAuctionExcludedField =
  (typeof DEALER_AUCTION_EXCLUDED_FIELDS)[number]

export type CreateAuctionInput = Pick<
  Auction,
  | 'vehicleId'
  | 'startsAt'
  | 'endsAt'
  | 'startingPrice'
  | 'reservePrice'
  | 'minIncrement'
>
