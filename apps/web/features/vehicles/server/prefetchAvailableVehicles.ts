import type { Vehicle } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { VEHICLE_ENDPOINTS } from "../data/endpoints"
import { getAvailableVehiclesQuery } from "../data/queries"

export async function prefetchAvailableVehicles(
  queryClient: QueryClient,
  limit?: number
) {
  await queryClient
    .query({
      ...getAvailableVehiclesQuery(limit),
      queryFn: () =>
        fetchApi<Vehicle[]>(VEHICLE_ENDPOINTS.available, {
          queryParams: { limit },
        }),
    })
    .catch(() => undefined)
}
