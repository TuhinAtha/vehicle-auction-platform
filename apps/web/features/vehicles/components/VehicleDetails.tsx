import type { Vehicle } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { distance, kwh, monthYear } from "@/lib/intl"

export const VehicleDetails = ({ vehicle }: { vehicle: Vehicle }) => {
  const soh = `${vehicle.batterySohPercent} %`
  const capacity = `${kwh.format(vehicle.batteryCapacityKwh)} kWh`
  const mileage = distance.format(vehicle.mileage)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Battery</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 *:border-t *:py-2 sm:grid-cols-2">
            <LabeledValue label="Capacity" dir="horizontal">
              {capacity}
            </LabeledValue>
            <LabeledValue label="State of health" dir="horizontal">
              {soh}
            </LabeledValue>
            <LabeledValue label="Range" dir="horizontal">
              {distance.format(vehicle.rangeKm)}
            </LabeledValue>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 *:border-t *:py-2 sm:grid-cols-2">
            <LabeledValue label="Make" dir="horizontal">
              {vehicle.make}
            </LabeledValue>
            <LabeledValue label="Model" dir="horizontal">
              {vehicle.model}
            </LabeledValue>
            <LabeledValue label="Year" dir="horizontal">
              {vehicle.year}
            </LabeledValue>
            <LabeledValue label="First registration" dir="horizontal">
              {monthYear.format(new Date(vehicle.registrationDate))}
            </LabeledValue>
            <LabeledValue label="Mileage" dir="horizontal">
              {mileage}
            </LabeledValue>
            <LabeledValue label="Location" dir="horizontal">
              {vehicle.city}, {vehicle.country}
            </LabeledValue>
            <LabeledValue label="VIN" dir="horizontal">
              {vehicle.vin}
            </LabeledValue>
            {vehicle.condition && (
              <LabeledValue label="Condition" dir="horizontal">
                {vehicle.condition}
              </LabeledValue>
            )}
          </dl>
        </CardContent>
      </Card>
    </>
  )
}
