import type { Vehicle, VehicleAvailability } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { distance } from "@/lib/intl"
import { VehicleAvailabilityBadge } from "./VehicleAvailabilityBadge"
import { VehiclePhoto } from "./VehiclePhoto"

export const VehicleCard = ({
  vehicle,
  availability,
}: {
  vehicle: Vehicle
  availability: VehicleAvailability
}) => (
  <Card className="h-full pt-0">
    <VehiclePhoto vehicle={vehicle} />
    <CardHeader>
      <CardAction>
        <VehicleAvailabilityBadge availability={availability} />
      </CardAction>
      <CardTitle className="truncate">
        {vehicle.make} {vehicle.model}
      </CardTitle>
      <CardDescription>
        {vehicle.year} - {vehicle.city}
      </CardDescription>
    </CardHeader>

    <CardContent className="flex flex-1 flex-col divide-y">
      <dl className="grid grid-cols-3 gap-x-4 pb-4">
        <LabeledValue label="Battery health">
          {vehicle.batterySohPercent} %
        </LabeledValue>
        <LabeledValue label="Capacity">
          {vehicle.batteryCapacityKwh} kWh
        </LabeledValue>
        <LabeledValue label="Mileage" className="items-end text-right">
          {distance.format(vehicle.mileage)}
        </LabeledValue>
      </dl>

      <dl className="grid grid-cols-3 gap-x-4 pt-4">
        <LabeledValue label="Range">
          {distance.format(vehicle.rangeKm)}
        </LabeledValue>
        <LabeledValue label="VIN" className="col-span-2 items-end text-right">
          {vehicle.vin}
        </LabeledValue>
      </dl>
    </CardContent>
  </Card>
)
