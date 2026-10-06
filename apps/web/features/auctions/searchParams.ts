import { AUCTION_PHASES, BID_STATUSES } from "@repo/shared"
import {
  createLoader,
  createSerializer,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server"

const auctionsSearchParams = {
  phase: parseAsStringLiteral(AUCTION_PHASES),
}
export const loadAuctionsSearchParams = createLoader(auctionsSearchParams)
export const serializeAuctionsSearchParams =
  createSerializer(auctionsSearchParams)

const myBidsSearchParams = {
  phase: parseAsStringLiteral(BID_STATUSES),
}
export const loadMyBidsSearchParams = createLoader(myBidsSearchParams)
export const serializeMyBidsSearchParams = createSerializer(myBidsSearchParams)

export const loadNewAuctionSearchParams = createLoader({
  vehicleId: parseAsString,
})
