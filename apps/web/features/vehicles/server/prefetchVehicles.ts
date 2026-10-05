import type { Vehicle } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { VEHICLE_ENDPOINTS } from "../data/endpoints"
import { getVehiclesQuery } from "../data/queries"
import type { VehiclesQueryParams } from "../types"

export async function prefetchVehicles(
  queryClient: QueryClient,
  queryParams: VehiclesQueryParams
) {
  await queryClient
    .query({
      ...getVehiclesQuery({ queryParams }),
      queryFn: () =>
        fetchApi<Vehicle[]>(VEHICLE_ENDPOINTS.root, { queryParams }),
    })
    .catch(() => undefined)
}
