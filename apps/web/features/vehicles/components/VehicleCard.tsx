import type { VehicleSummary } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getTiming } from "@/features/auctions/lib/getTimingLabel"
import { distance, price } from "@/lib/intl"
import { VehiclePhoto } from "./VehiclePhoto"

export const VehicleCard = ({ vehicle }: { vehicle: VehicleSummary }) => {
  const timing = vehicle.auction && getTiming(vehicle.auction)

  return (
    <Card className="h-full cursor-pointer pt-0 transition-shadow hover:shadow-md hover:ring-foreground/20">
      <VehiclePhoto vehicle={vehicle} />
      <CardHeader>
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
          {vehicle.auction && timing ? (
            <>
              <LabeledValue label={timing.label} className="col-span-2">
                {timing.date}
              </LabeledValue>
              <LabeledValue
                label="Starting price"
                className="items-end text-right"
              >
                {price.format(vehicle.auction.startingPrice)}
              </LabeledValue>
            </>
          ) : (
            <>
              <LabeledValue label="Range">
                {distance.format(vehicle.rangeKm)}
              </LabeledValue>
              <LabeledValue
                label="VIN"
                className="col-span-2 items-end text-right"
              >
                {vehicle.vin}
              </LabeledValue>
            </>
          )}
        </dl>
      </CardContent>

      {vehicle.auction && (
        <CardFooter>
          <dl className="flex w-full items-center justify-between gap-4">
            <LabeledValue label="Reserve price">
              {price.format(vehicle.auction.reservePrice)}
            </LabeledValue>
            <LabeledValue
              label={
                vehicle.auction.result === "SOLD"
                  ? "Winning bid"
                  : "Highest bid"
              }
              className="items-end text-right"
            >
              {vehicle.auction.highestBid
                ? price.format(vehicle.auction.highestBid.amount)
                : "No bids"}
            </LabeledValue>
          </dl>
        </CardFooter>
      )}
    </Card>
  )
}
