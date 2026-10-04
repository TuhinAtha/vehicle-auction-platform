import type {
  AuctionDetailAdmin,
  AuctionDetailDealer,
  AuctionSummaryAdmin,
  AuctionSummaryDealer,
} from "@repo/shared"
import type { inferParserType } from "nuqs/server"

import type { auctionsSearchParams, myBidsSearchParams } from "./searchParams"

export type AuctionsQueryParams = inferParserType<typeof auctionsSearchParams>

/** An item of GET /auctions; which shape it is depends on the caller's role. */
export type AuctionSummary = AuctionSummaryAdmin | AuctionSummaryDealer

export type AuctionDetail = AuctionDetailAdmin | AuctionDetailDealer

export type MyBidsQueryParams = inferParserType<typeof myBidsSearchParams>
