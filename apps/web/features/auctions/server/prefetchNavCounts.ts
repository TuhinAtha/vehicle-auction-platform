import type {
  AuctionPhaseCounts,
  BidStatusCounts,
  UserRole,
  VehicleAvailabilityCounts,
} from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { VEHICLE_ENDPOINTS } from "@/features/vehicles/data/endpoints"
import { getVehicleAvailabilityCountsQuery } from "@/features/vehicles/data/queries"
import { fetchApi } from "@/lib/fetch-api"
import { AUCTION_ENDPOINTS } from "../data/endpoints"
import {
  getAuctionPhaseCountsQuery,
  getBidStatusCountsQuery,
} from "../data/queries"

export async function prefetchNavCounts(
  queryClient: QueryClient,
  role: UserRole
) {
  await Promise.all([
    queryClient
      .query({
        ...getAuctionPhaseCountsQuery(),
        queryFn: () => fetchApi<AuctionPhaseCounts>(AUCTION_ENDPOINTS.counts),
      })
      .catch(() => undefined),

    role === "DEALER" &&
      queryClient
        .query({
          ...getBidStatusCountsQuery(),
          queryFn: () =>
            fetchApi<BidStatusCounts>(AUCTION_ENDPOINTS.myBidCounts),
        })
        .catch(() => undefined),

    role === "ADMIN" &&
      queryClient
        .query({
          ...getVehicleAvailabilityCountsQuery(),
          queryFn: () =>
            fetchApi<VehicleAvailabilityCounts>(VEHICLE_ENDPOINTS.counts),
        })
        .catch(() => undefined),
  ])
}
