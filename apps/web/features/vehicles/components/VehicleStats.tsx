import type { Vehicle } from "@repo/shared"

import { StatCard } from "@/components/StatCard"
import { Progress } from "@/components/ui/progress"
import { distance } from "@/lib/distance"
import { kwh } from "@/lib/kwh"

export const VehicleStats = ({ vehicle }: { vehicle: Vehicle }) => {
  const soh = `${vehicle.batterySohPercent} %`
  const usableKwh =
    (vehicle.batteryCapacityKwh * vehicle.batterySohPercent) / 100

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Battery state of health" value={soh}>
        <Progress
          value={vehicle.batterySohPercent}
          aria-label="Battery state of health"
          className="pt-1"
        />
      </StatCard>
      <StatCard
        label="Capacity"
        value={`${kwh.format(vehicle.batteryCapacityKwh)} kWh`}
      >
        ≈ {kwh.format(usableKwh)} kWh at {soh} health
      </StatCard>
      <StatCard label="Mileage" value={distance.format(vehicle.mileage)}>
        First registered {vehicle.registrationDate.slice(0, 4)}
      </StatCard>
    </div>
  )
}
