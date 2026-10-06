import type { VehicleDetail } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AuctionResultBadge } from "@/features/auctions/components/AuctionResultBadge"
import { datetime, distance, price } from "@/lib/intl"

export const SelectedVehicle = ({ vehicle }: { vehicle: VehicleDetail }) => {
  const lastAuction = vehicle.auctions.at(0)

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {vehicle.make} {vehicle.model}
        </CardTitle>
        <CardDescription>
          {vehicle.year} - {vehicle.city}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        <dl className="grid grid-cols-2 gap-4 pb-4 last:pb-0 sm:grid-cols-4">
          <LabeledValue label="Battery health">
            {vehicle.batterySohPercent} %
          </LabeledValue>
          <LabeledValue label="Capacity">
            {vehicle.batteryCapacityKwh} kWh
          </LabeledValue>
          <LabeledValue label="Mileage">
            {distance.format(vehicle.mileage)}
          </LabeledValue>
          <LabeledValue label="VIN">{vehicle.vin}</LabeledValue>
        </dl>

        {lastAuction && (
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-muted-foreground">
                Last auction · ended{" "}
                {datetime.format(new Date(lastAuction.endsAt))}
              </p>
              <AuctionResultBadge result={lastAuction.result} />
            </div>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <LabeledValue label="Starting price">
                {price.format(lastAuction.startingPrice)}
              </LabeledValue>
              <LabeledValue label="Reserve price">
                {price.format(lastAuction.reservePrice)}
              </LabeledValue>
              <LabeledValue label="Minimum increment">
                {price.format(lastAuction.minIncrement)}
              </LabeledValue>
              <LabeledValue label="Highest bid">
                {lastAuction.highestBid
                  ? price.format(lastAuction.highestBid.amount)
                  : "No bids"}
              </LabeledValue>
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
