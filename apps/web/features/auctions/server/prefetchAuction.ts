import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import { getAuctionQuery } from "../data/queries"
import type { AuctionDetail } from "../types"

export async function prefetchAuction(queryClient: QueryClient, id: string) {
  await queryClient
    .query({
      ...getAuctionQuery(id),
      queryFn: () => fetchApi<AuctionDetail>(AUCTION_ENDPOINTS.detail(id)),
    })
    .catch(() => undefined)
}
