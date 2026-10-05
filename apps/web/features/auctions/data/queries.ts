import type {
  AuctionPhaseCounts,
  AuctionSummaryMyBid,
  BidStatusCounts,
} from "@repo/shared"
import { queryOptions } from "@tanstack/react-query"
import type {
  AuctionDetail,
  AuctionsQueryParams,
  AuctionSummary,
  MyBidsQueryParams,
} from "../types"

import { fetchBff } from "@/lib/fetch-bff"
import { AUCTION_ENDPOINTS } from "./endpoints"
import { AUCTION_QUERY_KEYS } from "./queryKeys"

export const getAuctionsQuery = ({
  queryParams,
}: {
  queryParams: AuctionsQueryParams
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

export const getAuctionQuery = (id: string) =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.detail(id),
    queryFn: ({ signal }) =>
      fetchBff<AuctionDetail>(AUCTION_ENDPOINTS.detail(id), { signal }),
  })

export const getMyBidsQuery = ({
  queryParams,
}: {
  queryParams: MyBidsQueryParams
}) =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.myBids(queryParams),
    queryFn: ({ signal }) =>
      fetchBff<AuctionSummaryMyBid[]>(AUCTION_ENDPOINTS.myBids, {
        queryParams,
        signal,
      }),
  })

export const getBidStatusCountsQuery = () =>
  queryOptions({
    queryKey: AUCTION_QUERY_KEYS.myBidCounts(),
    queryFn: ({ signal }) =>
      fetchBff<BidStatusCounts>(AUCTION_ENDPOINTS.myBidCounts, { signal }),
  })
