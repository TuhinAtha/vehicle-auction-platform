import type { VehicleAuction, VehicleDetail } from "@repo/shared"
import Link from "next/link"

import { LabeledValue } from "@/components/LabeledValue"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AuctionTiming } from "@/features/auctions/components/AuctionTiming"
import { price } from "@/lib/intl"

const ViewAuctionLink = ({ auction }: { auction: VehicleAuction }) => (
  <Link
    href={`/admin/auctions/${auction.id}`}
    className={buttonVariants({ size: "lg", className: "w-full" })}
  >
    View auction
  </Link>
)

export const VehicleSideCard = ({ vehicle }: { vehicle: VehicleDetail }) => {
  const soldAuction = vehicle.auctions.find(({ result }) => result === "SOLD")
  const openAuction = vehicle.auctions.find(({ result }) => result === null)

  return (
    <Card className="lg:sticky lg:top-18">
      <CardContent className="flex flex-col gap-4">
        {soldAuction ? (
          <>
            <div>
              <p className="text-sm text-muted-foreground">Sold for</p>
              <p className="text-2xl font-semibold tabular-nums">
                {soldAuction.highestBid
                  ? price.format(soldAuction.highestBid.amount)
                  : "–"}
              </p>
            </div>
            <ViewAuctionLink auction={soldAuction} />
          </>
        ) : openAuction ? (
          <>
            <AuctionTiming auction={openAuction} />
            <dl className="flex flex-col gap-1 border-t pt-3">
              <LabeledValue label="Reserve price" dir="horizontal">
                {price.format(openAuction.reservePrice)}
              </LabeledValue>
              <LabeledValue label="Highest bid" dir="horizontal">
                {openAuction.highestBid
                  ? price.format(openAuction.highestBid.amount)
                  : "No bids"}
              </LabeledValue>
            </dl>
            <ViewAuctionLink auction={openAuction} />
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              This vehicle is not in an auction.
            </p>
            <Link
              href={`/admin/auctions/post?vehicleId=${vehicle.id}`}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              Create auction
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
