import type { Auction, AuctionPhase, AuctionPhaseCounts } from "@repo/shared"
import { queryOptions } from "@tanstack/react-query"

import { fetchBff } from "@/lib/fetch-bff"
import { AUCTION_ENDPOINTS } from "./endpoints"
import { AUCTION_QUERY_KEYS } from "./queryKeys"

export const getAuctionsQuery = ({
  searchParams,
}: {
  searchParams?: { phase?: AuctionPhase }
}) =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.list(searchParams),
    queryFn: ({ signal }) =>
      fetchBff<Auction[]>(AUCTION_ENDPOINTS.root, {
        params: searchParams,
        signal,
      }),
  })

export const getAuctionPhaseCountsQuery = () =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.counts(),
    queryFn: ({ signal }) =>
      fetchBff<AuctionPhaseCounts>(AUCTION_ENDPOINTS.counts, { signal }),
  })
