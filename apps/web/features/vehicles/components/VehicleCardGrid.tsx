import type { VehicleSummary } from "@repo/shared"
import Link from "next/link"

import { VehicleCard } from "./VehicleCard"

export const VehicleCardGrid = ({
  vehicles,
}: {
  vehicles: VehicleSummary[]
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
          {vehicle.auction ? (
            <Link href={`/admin/auctions/${vehicle.auction.id}`}>
              <VehicleCard vehicle={vehicle} />
            </Link>
          ) : (
            <VehicleCard vehicle={vehicle} />
          )}
        </li>
      ))}
    </ul>
  )
}
