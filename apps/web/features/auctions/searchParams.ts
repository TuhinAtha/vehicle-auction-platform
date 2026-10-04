import { AUCTION_PHASES, BID_STATUSES } from "@repo/shared"
import { createLoader, parseAsStringLiteral } from "nuqs/server"

export const auctionsSearchParams = {
  phase: parseAsStringLiteral(AUCTION_PHASES),
}
export const loadAuctionsSearchParams = createLoader(auctionsSearchParams)

export const myBidsSearchParams = {
  phase: parseAsStringLiteral(BID_STATUSES),
}
export const loadMyBidsSearchParams = createLoader(myBidsSearchParams)
