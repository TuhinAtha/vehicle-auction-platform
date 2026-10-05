import type { CreateVehicleInput, Vehicle } from "@repo/shared"

import { fetchBff } from "@/lib/fetch-bff"
import {
  type VehicleFormValues,
  vehicleFormSchema,
} from "../lib/vehicleFormSchema"
import { VEHICLE_ENDPOINTS } from "./endpoints"

export function createVehicle(values: VehicleFormValues) {
  const vehicle = vehicleFormSchema.parse(values)

  return fetchBff<Vehicle>(VEHICLE_ENDPOINTS.root, {
    method: "POST",
    body: {
      ...vehicle,
      condition: vehicle.condition || null,
    } satisfies CreateVehicleInput,
  })
}

export function uploadVehiclePhoto(photo: File) {
  const body = new FormData()
  body.append("photo", photo)

  return fetchBff<{ path: string }>(VEHICLE_ENDPOINTS.photos, {
    method: "POST",
    body,
  })
}
