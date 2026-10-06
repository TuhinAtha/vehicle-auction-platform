import type { QueryClient } from "@tanstack/react-query"

import { getVehiclesQuery } from "../data/queries"
import type { VehiclesQueryParams } from "../types"
import { fetchVehicles } from "./fetchVehicles"

export async function prefetchVehicles(
  queryClient: QueryClient,
  queryParams: VehiclesQueryParams
) {
  await queryClient
    .query({
      ...getVehiclesQuery({ queryParams }),
      queryFn: () => fetchVehicles(queryParams),
    })
    .catch(() => undefined)
}
