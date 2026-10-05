import type { VehicleSummary } from "@repo/shared"
import { cn } from "cn"

import { LabeledValue } from "@/components/LabeledValue"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { datetime, distance, price } from "@/lib/intl"
import { VehiclePhoto } from "./VehiclePhoto"

export const VehicleCard = ({ vehicle }: { vehicle: VehicleSummary }) => (
  <Card
    className={cn(
      "h-full pt-0",
      vehicle.auction &&
        "cursor-pointer transition-shadow hover:shadow-md hover:ring-foreground/20"
    )}
  >
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
        {vehicle.auction ? (
          <>
            <LabeledValue label="Ended" className="col-span-2">
              {datetime.format(new Date(vehicle.auction.endsAt))}
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
          {vehicle.auction.result === "SOLD" ? (
            <LabeledValue label="Winning bid" className="items-end text-right">
              {vehicle.auction.winningBidAmount !== undefined
                ? price.format(vehicle.auction.winningBidAmount)
                : "–"}
            </LabeledValue>
          ) : (
            <LabeledValue label="Highest bid" className="items-end text-right">
              {vehicle.auction.maxBidAmount !== undefined
                ? price.format(vehicle.auction.maxBidAmount)
                : "No bids"}
            </LabeledValue>
          )}
        </dl>
      </CardFooter>
    )}
  </Card>
)
