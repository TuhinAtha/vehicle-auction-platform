import type {
  Auction,
  Bid,
  CreateAuctionInput,
  CreateBidInput,
} from "@repo/shared"

import { fetchBff } from "@/lib/fetch-bff"
import {
  type AuctionFormValues,
  auctionFormSchema,
} from "../lib/createAuctionFormSchema"
import { AUCTION_ENDPOINTS } from "./endpoints"

export function createAuction(vehicleId: string, values: AuctionFormValues) {
  const auction = auctionFormSchema.parse(values)

  return fetchBff<Auction>(AUCTION_ENDPOINTS.root, {
    method: "POST",
    body: {
      ...auction,
      vehicleId,
      startsAt: new Date(auction.startsAt).toISOString(),
      endsAt: new Date(auction.endsAt).toISOString(),
    } satisfies CreateAuctionInput,
  })
}

export function placeBid(auctionId: string, amount: number) {
  return fetchBff<Bid>(AUCTION_ENDPOINTS.placeBid(auctionId), {
    method: "POST",
    body: { amount } satisfies CreateBidInput,
  })
}

export function raiseBid(auctionId: string, amount: number) {
  return fetchBff<Bid>(AUCTION_ENDPOINTS.raiseBid(auctionId), {
    method: "POST",
    body: { amount } satisfies CreateBidInput,
  })
}
