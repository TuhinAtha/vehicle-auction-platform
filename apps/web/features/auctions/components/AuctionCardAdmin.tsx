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
        <CardAction className="flex items-center gap-2">
          {auction.status === "ENDED" ? (
            <AuctionResultBadge result={auction.result} />
          ) : (
            <AuctionStatusBadge status={auction.status} />
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
          {auction.status === "SCHEDULED" ? (
            <LabeledValue
              label="Starting price"
              className="items-end text-right"
            >
              {price.format(auction.startingPrice)}
            </LabeledValue>
          ) : (
            <LabeledValue label="Highest bid" className="items-end text-right">
              {auction.maxBidAmount
                ? price.format(auction.maxBidAmount)
                : "No bids"}
            </LabeledValue>
          )}
        </dl>
      </CardContent>
      <CardFooter>
        <LabeledValue label="Reserve price">
          {price.format(auction.reservePrice)}
        </LabeledValue>
        {auction.maxBidAmount !== null &&
          (auction.maxBidAmount >= auction.reservePrice ? (
            <p className="ml-auto text-sm font-medium text-green-700 dark:text-green-300">
              Reserve met
            </p>
          ) : (
            <p className="ml-auto text-sm font-medium text-amber-700 dark:text-amber-300">
              Below Reserve
            </p>
          ))}
      </CardFooter>
    </Card>
  )
}
