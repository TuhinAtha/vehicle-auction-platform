import type { VehicleSummary } from "@repo/shared"

import { fetchApi } from "@/lib/fetch-api"
import { VEHICLE_ENDPOINTS } from "../data/endpoints"
import type { VehiclesQueryParams } from "../types"

export function fetchVehicles(queryParams: VehiclesQueryParams) {
  return fetchApi<VehicleSummary[]>(VEHICLE_ENDPOINTS.root, { queryParams })
}
