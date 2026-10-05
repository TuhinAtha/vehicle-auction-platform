"use client"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { distance, price, shortDatetime } from "@/lib/intl"
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto"
import { getTiming } from "../lib/getTimingLabel"
import type { AuctionSummaryDealer } from "@repo/shared"
import { AuctionCountdown } from "./AuctionCountdown"
import { LabeledValue } from "@/components/LabeledValue"

export const AuctionCardDealer = ({
  auction,
}: {
  auction: AuctionSummaryDealer
}) => {
  const { vehicle } = auction
  const timing = getTiming(auction)
  const isLive = auction.status === "LIVE"

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

        <dl className="grid grid-cols-3 gap-x-4 py-4 last:pb-0">
          {auction.status === "ENDED" ? (
            <LabeledValue label={timing.label} className="col-span-2">
              {timing.date}
            </LabeledValue>
          ) : (
            <LabeledValue label={`${timing.label} in`} className="col-span-2">
              <AuctionCountdown to={timing.at} title={timing.date} />
            </LabeledValue>
          )}
          <LabeledValue label="Starting price" className="items-end text-right">
            {price.format(auction.startingPrice)}
          </LabeledValue>
        </dl>
      </CardContent>
      <CardFooter>
        {isLive ? (
          <span
            className={buttonVariants({ size: "lg", className: "ml-auto" })}
          >
            Bid now
          </span>
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
