import type {
  AuctionPhaseCounts,
  BidStatusCounts,
  UserRole,
} from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import {
  getAuctionPhaseCountsQuery,
  getBidStatusCountsQuery,
} from "../data/queries"

export async function prefetchNavCounts(
  queryClient: QueryClient,
  role: UserRole
) {
  await Promise.all([
    queryClient
      .query({
        ...getAuctionPhaseCountsQuery(),
        queryFn: () => fetchApi<AuctionPhaseCounts>(AUCTION_ENDPOINTS.counts),
      })
      .catch(() => undefined),

    role === "DEALER" &&
      queryClient
        .query({
          ...getBidStatusCountsQuery(),
          queryFn: () =>
            fetchApi<BidStatusCounts>(AUCTION_ENDPOINTS.myBidCounts),
        })
        .catch(() => undefined),
  ])
}
