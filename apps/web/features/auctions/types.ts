import {
  AUCTION_PHASES,
  type AuctionSummaryAdmin,
  type AuctionSummaryDealer,
} from "@repo/shared"

export type AuctionsQueryParams = {
  phase?: (typeof AUCTION_PHASES)[number]
}

/** An item of GET /auctions; which shape it is depends on the caller's role. */
export type AuctionSummary = AuctionSummaryAdmin | AuctionSummaryDealer
