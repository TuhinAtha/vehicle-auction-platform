import type { VehicleAvailability } from "@repo/shared"

export type VehiclesQueryParams = {
  availability: VehicleAvailability
  limit?: number
}
