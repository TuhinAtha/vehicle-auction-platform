import type { AuctionSummaryMyBid } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import { getMyBidsQuery } from "../data/queries"
import type { MyBidsQueryParams } from "../types"

export async function prefetchMyBids(
  queryClient: QueryClient,
  queryParams: MyBidsQueryParams
) {
  await queryClient
    .query({
      ...getMyBidsQuery({ queryParams }),
      queryFn: () =>
        fetchApi<AuctionSummaryMyBid[]>(AUCTION_ENDPOINTS.myBids, {
          queryParams,
        }),
    })
    .catch(() => undefined)
}
