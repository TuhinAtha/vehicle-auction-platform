import type { QueryClient } from "@tanstack/react-query"
import type { AuctionPhaseCounts } from "@repo/shared"
import {
  getAuctionsQuery,
  getAuctionPhaseCountsQuery,
} from "@/features/auctions/data/queries"
import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import type { AuctionsQueryParams, AuctionSummary } from "../types"

export async function prefetchAuctions(
  queryClient: QueryClient,
  queryParams?: AuctionsQueryParams
) {
  await Promise.all([
    queryClient
      .query({
        ...getAuctionsQuery({ queryParams }),
        queryFn: () =>
          fetchApi<AuctionSummary[]>(AUCTION_ENDPOINTS.root, {
            queryParams,
          }),
      })
      .catch(() => undefined),

    queryClient
      .query({
        ...getAuctionPhaseCountsQuery(),
        queryFn: () => fetchApi<AuctionPhaseCounts>(AUCTION_ENDPOINTS.counts),
      })
      .catch(() => undefined),
  ])
}
