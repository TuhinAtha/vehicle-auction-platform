"use client"

import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { price } from "@/lib/price"
import { AuctionSummaryAdmin } from "@repo/shared"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LabeledValue } from "@/components/LabeledValue"
import { distance } from "@/lib/distance"
import { getTiming } from "../lib/getTimingLabel"

export const AuctionCardAdmin = ({
  auction,
}: {
  auction: AuctionSummaryAdmin
}) => {
  const { vehicle } = auction
  const timing = getTiming(auction)
  return (
    <Card className="h-full">
      <CardHeader>
        <CardAction className="flex items-center gap-2">
          <AuctionStatusBadge status={auction.status} />
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

        <dl className="grid grid-cols-3 gap-x-4 py-4 last:pb-0">
          <LabeledValue label={timing.label} className="col-span-2">
            {timing.date}
          </LabeledValue>
          <LabeledValue label="Starting price" className="items-end text-right">
            {price.format(auction.startingPrice)}
          </LabeledValue>
        </dl>
      </CardContent>
    </Card>
  )
}
