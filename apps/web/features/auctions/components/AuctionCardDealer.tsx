"use client"

import type { AuctionStatus } from "@repo/shared"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card"
import { distance } from "@/lib/distance"
import { price } from "@/lib/price"
import { getTiming } from "../lib/getTimingLabel"
import type { AuctionSummaryDealer } from "@repo/shared"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { LabeledValue } from "@/components/LabeledValue"

export const AuctionCardDealer = ({
  auction,
}: {
  auction: AuctionSummaryDealer
}) => {
  const { vehicle, myBidAmount } = auction
  const timing = getTiming(auction)
  const bidAction = getBidAction(auction.status, myBidAmount)

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
      <CardFooter>
        <div className="grid w-full grid-cols-3 items-center gap-x-4">
          {myBidAmount !== null && (
            <dl>
              <LabeledValue label="Your bid">
                {price.format(myBidAmount)}
              </LabeledValue>
            </dl>
          )}
          {bidAction && (
            <Button
              size="lg"
              disabled={bidAction.disabled}
              className="col-start-3 justify-self-end"
            >
              {bidAction.label}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

function getBidAction(status: AuctionStatus, myBidAmount: number | null) {
  switch (status) {
    case "SCHEDULED":
      return { label: "Opens soon", disabled: true }
    case "LIVE":
      return {
        label: myBidAmount === null ? "Start bidding" : "Increase bid",
        disabled: false,
      }
    case "ENDED":
      return null
  }
}
