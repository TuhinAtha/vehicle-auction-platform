import type { Vehicle, VehicleAvailabilityCounts } from "@repo/shared"
import type { VehiclesQueryParams } from "../types"
import { queryOptions } from "@tanstack/react-query"

import { fetchBff } from "@/lib/fetch-bff"
import { VEHICLE_ENDPOINTS } from "./endpoints"
import { VEHICLE_QUERY_KEYS } from "./queryKeys"

export const getVehiclesQuery = ({
  queryParams,
}: {
  queryParams: VehiclesQueryParams
}) =>
  queryOptions({
    queryKey: VEHICLE_QUERY_KEYS.list(queryParams),
    queryFn: ({ signal }) =>
      fetchBff<Vehicle[]>(VEHICLE_ENDPOINTS.root, {
        queryParams,
        signal,
      }),
  })

export const getVehicleAvailabilityCountsQuery = () =>
  queryOptions({
    queryKey: VEHICLE_QUERY_KEYS.counts(),
    queryFn: ({ signal }) =>
      fetchBff<VehicleAvailabilityCounts>(VEHICLE_ENDPOINTS.counts, { signal }),
  })
