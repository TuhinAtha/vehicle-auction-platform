import type { VehicleDetail } from "@repo/shared"

import { fetchApi } from "@/lib/fetch-api"
import { VEHICLE_ENDPOINTS } from "../data/endpoints"

export function fetchVehicle(id: string) {
  return fetchApi<VehicleDetail>(VEHICLE_ENDPOINTS.detail(id)).catch(
    () => undefined
  )
}
