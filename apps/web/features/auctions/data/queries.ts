import type { AuctionPhaseCounts } from "@repo/shared"
import { queryOptions } from "@tanstack/react-query"
import type { AuctionsQueryParams, AuctionSummary } from "../types"

import { fetchBff } from "@/lib/fetch-bff"
import { AUCTION_ENDPOINTS } from "./endpoints"
import { AUCTION_QUERY_KEYS } from "./queryKeys"

export const getAuctionsQuery = ({
  queryParams,
}: {
  queryParams?: AuctionsQueryParams
}) =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.list(queryParams),
    queryFn: ({ signal }) =>
      fetchBff<AuctionSummary[]>(AUCTION_ENDPOINTS.root, {
        queryParams,
        signal,
      }),
  })

export const getAuctionPhaseCountsQuery = () =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.counts(),
    queryFn: ({ signal }) =>
      fetchBff<AuctionPhaseCounts>(AUCTION_ENDPOINTS.counts, { signal }),
  })
