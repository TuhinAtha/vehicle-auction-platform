"use client"

import { AuctionResultBadge } from "./AuctionResultBadge"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { distance, price } from "@/lib/intl"
import { AuctionSummaryAdmin } from "@repo/shared"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { LabeledValue } from "@/components/LabeledValue"
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto"
import { getTiming } from "../lib/getTimingLabel"
import { AuctionCountdown } from "./AuctionCountdown"

export const AuctionCardAdmin = ({
  auction,
}: {
  auction: AuctionSummaryAdmin
}) => {
  const { vehicle } = auction
  const timing = getTiming(auction)
  return (
    <Card className="h-full cursor-pointer pt-0 transition-shadow hover:shadow-md hover:ring-foreground/20">
      <VehiclePhoto vehicle={vehicle} />
      <CardHeader>
        <CardAction className="flex flex-col items-end gap-1">
          {auction.status === "ENDED" ? (
            <AuctionResultBadge result={auction.result} />
          ) : (
            <AuctionStatusBadge status={auction.status} />
          )}
          {auction.bidCount > 0 && (
            <span className="text-sm text-muted-foreground tabular-nums">
              {auction.bidCount} {auction.bidCount === 1 ? "bid" : "bids"}
            </span>
          )}
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

        <dl className="grid grid-cols-2 gap-x-4 py-4 last:pb-0">
          {auction.status === "ENDED" ? (
            <LabeledValue label={timing.label}>{timing.date}</LabeledValue>
          ) : (
            <LabeledValue label={`${timing.label} in`}>
              <AuctionCountdown to={timing.at} title={timing.date} />
            </LabeledValue>
          )}

          <LabeledValue label="Starting price" className="items-end text-right">
            {price.format(auction.startingPrice)}
          </LabeledValue>
        </dl>
      </CardContent>
      <CardFooter>
        <dl className="flex w-full items-center justify-between gap-4">
          <LabeledValue label="Reserve price">
            {price.format(auction.reservePrice)}
          </LabeledValue>
          <LabeledValue label="Highest bid" className="items-end text-right">
            {auction.maxBidAmount
              ? price.format(auction.maxBidAmount)
              : "No bids"}
          </LabeledValue>
        </dl>
      </CardFooter>
    </Card>
  )
}
