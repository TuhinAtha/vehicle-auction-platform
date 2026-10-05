import type { AuctionDetailDealer } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import { getMyBidQuery } from "../data/queries"

export async function prefetchMyBid(queryClient: QueryClient, id: string) {
  await queryClient
    .query({
      ...getMyBidQuery(id),
      queryFn: () => fetchApi<AuctionDetailDealer>(AUCTION_ENDPOINTS.myBid(id)),
    })
    .catch(() => undefined)
}
