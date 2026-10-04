import type { Vehicle } from "@repo/shared"

import { VehicleDetails } from "@/features/vehicles/components/VehicleDetails"
import { VehicleStats } from "@/features/vehicles/components/VehicleStats"

export const AuctionDetailLayout = ({
  vehicle,
  badge,
  sideCard,
  children,
}: {
  vehicle: Vehicle
  badge: React.ReactNode
  sideCard: React.ReactNode
  children?: React.ReactNode
}) => (
  <div className="grid max-w-6xl items-start gap-4 lg:grid-cols-3">
    <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
      <header>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-2xl font-semibold">
            {vehicle.make} {vehicle.model}
          </h2>
          {badge}
        </div>
        <p className="text-muted-foreground">
          {vehicle.year} · {vehicle.city}, {vehicle.country}
        </p>
      </header>
      <VehicleStats vehicle={vehicle} />
      {children}
      <VehicleDetails vehicle={vehicle} />
    </div>
    {sideCard}
  </div>
)
