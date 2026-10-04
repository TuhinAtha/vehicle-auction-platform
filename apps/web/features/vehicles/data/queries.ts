import type { Vehicle } from "@repo/shared"
import { queryOptions } from "@tanstack/react-query"

import { fetchBff } from "@/lib/fetch-bff"
import { VEHICLE_ENDPOINTS } from "./endpoints"
import { VEHICLE_QUERY_KEYS } from "./queryKeys"

export const getVehiclesQuery = () =>
  queryOptions({
    queryKey: VEHICLE_QUERY_KEYS.list(),
    queryFn: ({ signal }) =>
      fetchBff<Vehicle[]>(VEHICLE_ENDPOINTS.root, { signal }),
  })

export const getAvailableVehiclesQuery = (limit?: number) =>
  queryOptions({
    queryKey: VEHICLE_QUERY_KEYS.available(limit),
    queryFn: ({ signal }) =>
      fetchBff<Vehicle[]>(VEHICLE_ENDPOINTS.available, {
        queryParams: { limit },
        signal,
      }),
  })
