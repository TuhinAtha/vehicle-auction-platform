import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import { getAuctionsQuery } from "../data/queries"
import type { AuctionsQueryParams, AuctionSummary } from "../types"

export async function prefetchAuctions(
  queryClient: QueryClient,
  queryParams: AuctionsQueryParams
) {
  await queryClient
    .query({
      ...getAuctionsQuery({ queryParams }),
      queryFn: () =>
        fetchApi<AuctionSummary[]>(AUCTION_ENDPOINTS.root, { queryParams }),
    })
    .catch(() => undefined)
}
