import { VEHICLE_AVAILABILITIES } from "@repo/shared"
import {
  createLoader,
  createSerializer,
  parseAsStringLiteral,
} from "nuqs/server"

const vehiclesSearchParams = {
  availability: parseAsStringLiteral(VEHICLE_AVAILABILITIES),
}
export const loadVehiclesSearchParams = createLoader(vehiclesSearchParams)
export const serializeVehiclesSearchParams =
  createSerializer(vehiclesSearchParams)
