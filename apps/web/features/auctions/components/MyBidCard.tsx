import type { AuctionSummaryMyBid } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { distance, price, shortDatetime } from "@/lib/intl"
import { VehiclePhoto } from "@/features/vehicles/components/VehiclePhoto"
import { getTiming } from "../lib/getTimingLabel"
import { AuctionCountdown } from "./AuctionCountdown"

export const MyBidCard = ({ auction }: { auction: AuctionSummaryMyBid }) => {
  const { vehicle } = auction
  const timing = getTiming(auction)
  const isActive = auction.bidStatus === "ACTIVE"

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

        <dl className="grid grid-cols-2 gap-x-4 py-4 last:pb-0">
          <LabeledValue label="Starting price">
            {price.format(auction.startingPrice)}
          </LabeledValue>
          <LabeledValue label="Your bid" className="items-end text-right">
            {price.format(auction.myBidAmount)}
          </LabeledValue>
        </dl>
      </CardContent>

      <CardFooter className="justify-between gap-4">
        <dl>
          {isActive ? (
            <LabeledValue label={`${timing.label} in`}>
              <AuctionCountdown to={timing.at} title={timing.date} />
            </LabeledValue>
          ) : (
            <LabeledValue label={timing.label}>
              {shortDatetime.format(new Date(timing.at))}
            </LabeledValue>
          )}
        </dl>
        <span
          className={buttonVariants({
            size: "lg",
            variant: isActive ? "default" : "outline",
          })}
        >
          {isActive ? "Raise bid" : "View details"}
        </span>
      </CardFooter>
    </Card>
  )
}
