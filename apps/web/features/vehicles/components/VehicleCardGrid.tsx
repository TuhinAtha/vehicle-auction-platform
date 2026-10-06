import type { VehicleAvailability, VehicleSummary } from "@repo/shared"
import Link from "next/link"

import { serializeVehiclesSearchParams } from "../searchParams"
import { VehicleCard } from "./VehicleCard"

export const VehicleCardGrid = ({
  vehicles,
  availability,
}: {
  vehicles: VehicleSummary[]
  availability: VehicleAvailability
}) => {
  if (vehicles.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No vehicles to show.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id}>
          <Link
            href={serializeVehiclesSearchParams(
              `/admin/vehicles/${vehicle.id}`,
              { availability }
            )}
          >
            <VehicleCard vehicle={vehicle} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
