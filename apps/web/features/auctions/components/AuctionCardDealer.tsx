"use client"

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
import { shortDatetime } from "@/lib/datetime"
import { price } from "@/lib/price"
import { getTiming } from "../lib/getTimingLabel"
import type { AuctionSummaryDealer } from "@repo/shared"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { LabeledValue } from "@/components/LabeledValue"
import { Countdown } from "@/components/Countdown"

export const AuctionCardDealer = ({
  auction,
}: {
  auction: AuctionSummaryDealer
}) => {
  const { vehicle, myBidAmount } = auction
  const timing = getTiming(auction)
  const isLive = auction.status === "LIVE"

  return (
    <Card className="h-full cursor-pointer transition-shadow hover:shadow-md hover:ring-foreground/20">
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
          {auction.status === "ENDED" ? (
            <LabeledValue label={timing.label} className="col-span-2">
              {timing.date}
            </LabeledValue>
          ) : (
            <LabeledValue label={`${timing.label} in`} className="col-span-2">
              <Countdown to={timing.at} title={timing.date} />
            </LabeledValue>
          )}
          <LabeledValue label="Starting price" className="items-end text-right">
            {price.format(auction.startingPrice)}
          </LabeledValue>
        </dl>
      </CardContent>
      <CardFooter>
        {isLive ? (
          <div className="grid w-full grid-cols-3 items-center gap-x-4">
            {myBidAmount !== null && (
              <dl>
                <LabeledValue label="Your bid">
                  {price.format(myBidAmount)}
                </LabeledValue>
              </dl>
            )}
            <Button size="lg" className="col-start-3 justify-self-end">
              {myBidAmount === null ? "Bid now" : "Raise bid"}
            </Button>
          </div>
        ) : (
          <dl>
            <LabeledValue label="Bidding">
              {shortDatetime.format(new Date(auction.startsAt))} –{" "}
              {shortDatetime.format(new Date(auction.endsAt))}
            </LabeledValue>
          </dl>
        )}
      </CardFooter>
    </Card>
  )
}
