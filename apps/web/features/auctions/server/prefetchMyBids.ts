import type { AuctionSummaryMyBid, BidStatusCounts } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import { getBidStatusCountsQuery, getMyBidsQuery } from "../data/queries"
import type { MyBidsQueryParams } from "../types"

export async function prefetchMyBids(
  queryClient: QueryClient,
  queryParams?: MyBidsQueryParams
) {
  await Promise.all([
    queryClient
      .query({
        ...getMyBidsQuery({ queryParams }),
        queryFn: () =>
          fetchApi<AuctionSummaryMyBid[]>(AUCTION_ENDPOINTS.myBids, {
            queryParams,
          }),
      })
      .catch(() => undefined),

    queryClient
      .query({
        ...getBidStatusCountsQuery(),
        queryFn: () => fetchApi<BidStatusCounts>(AUCTION_ENDPOINTS.myBidCounts),
      })
      .catch(() => undefined),
  ])
}
