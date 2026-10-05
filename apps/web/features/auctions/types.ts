import type {
  AuctionDetailAdmin,
  AuctionDetailDealer,
  AuctionPhase,
  AuctionSummaryAdmin,
  AuctionSummaryDealer,
  BidStatus,
} from "@repo/shared"

export type AuctionsQueryParams = { phase: AuctionPhase }

/** An item of GET /auctions; which shape it is depends on the caller's role. */
export type AuctionSummary = AuctionSummaryAdmin | AuctionSummaryDealer

export type AuctionDetail = AuctionDetailAdmin | AuctionDetailDealer

export type MyBidsQueryParams = { phase: BidStatus }
