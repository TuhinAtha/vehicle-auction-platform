import type { Vehicle } from "@repo/shared"
import type { QueryClient } from "@tanstack/react-query"

import { fetchApi } from "@/lib/fetch-api"
import { VEHICLE_ENDPOINTS } from "../data/endpoints"
import { getVehiclesQuery } from "../data/queries"

export async function prefetchVehicles(queryClient: QueryClient) {
  await queryClient
    .query({
      ...getVehiclesQuery(),
      queryFn: () => fetchApi<Vehicle[]>(VEHICLE_ENDPOINTS.root),
    })
    .catch(() => undefined)
}
