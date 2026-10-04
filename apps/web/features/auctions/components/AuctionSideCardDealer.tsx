import type { AuctionDetailDealer } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import { Card, CardContent } from "@/components/ui/card"
import { price, shortDatetime } from "@/lib/intl"
import { AuctionTiming } from "./AuctionTiming"
import { PlaceBidForm } from "./PlaceBidForm"

export const AuctionSideCardDealer = ({
  auction,
}: {
  auction: AuctionDetailDealer
}) => {
  const { myBid } = auction
  const isLive = auction.status === "LIVE"

  return (
    <Card className="lg:sticky lg:top-18">
      <CardContent className="flex flex-col gap-4">
        <AuctionTiming auction={auction} />

        <dl className="flex flex-col gap-1 border-t pt-3">
          <LabeledValue label="Starting price" dir="horizontal">
            {price.format(auction.startingPrice)}
          </LabeledValue>
          <LabeledValue label="Minimum increment" dir="horizontal">
            {price.format(auction.minIncrement)}
          </LabeledValue>
          <LabeledValue label="Format" dir="horizontal">
            Sealed bid
          </LabeledValue>
        </dl>

        {auction.status !== "SCHEDULED" && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground">
              {isLive ? "Your current bid" : "Your bid"}
            </p>
            {myBid ? (
              <>
                <p className="text-2xl font-semibold tabular-nums">
                  {price.format(myBid.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Placed {shortDatetime.format(new Date(myBid.createdAt))}
                </p>
              </>
            ) : (
              <p>
                {isLive
                  ? "You have not bid on this vehicle."
                  : "You did not bid on this vehicle."}
              </p>
            )}
          </div>
        )}

        {isLive && <PlaceBidForm auction={auction} />}
      </CardContent>
    </Card>
  )
}
