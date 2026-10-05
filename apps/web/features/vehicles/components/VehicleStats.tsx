import type { Vehicle } from "@repo/shared"

import { StatCard } from "@/components/StatCard"
import { Progress } from "@/components/ui/progress"
import { distance, kwh } from "@/lib/intl"

export const VehicleStats = ({ vehicle }: { vehicle: Vehicle }) => {
  const soh = `${vehicle.batterySohPercent} %`
  const usableKwh =
    (vehicle.batteryCapacityKwh * vehicle.batterySohPercent) / 100
  const adjustedRangeKm = (vehicle.rangeKm * vehicle.batterySohPercent) / 100

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <StatCard label="Range" value={distance.format(vehicle.rangeKm)}>
        ≈ {distance.format(adjustedRangeKm)} at {soh} health
      </StatCard>
    </div>
  )
}
