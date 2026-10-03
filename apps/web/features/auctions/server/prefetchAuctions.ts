import type { QueryClient } from "@tanstack/react-query"
import type { Auction, AuctionPhase, AuctionPhaseCounts } from "@repo/shared"
import {
  getAuctionsQuery,
  getAuctionPhaseCountsQuery,
} from "@/features/auctions/data/queries"
import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"

export async function prefetchAuctions(
  queryClient: QueryClient,
  searchParams?: {
    phase?: AuctionPhase
  }
) {
  await Promise.all([
    queryClient
      .query({
        ...getAuctionsQuery({ searchParams }),
        queryFn: () =>
          fetchApi<Auction[]>(AUCTION_ENDPOINTS.root, {
            params: searchParams,
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
