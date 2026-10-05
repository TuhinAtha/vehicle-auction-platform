import type { AuctionDetailAdmin } from "@repo/shared"
import { maxBy } from "es-toolkit"

import { LabeledValue } from "@/components/LabeledValue"
import { Card, CardContent } from "@/components/ui/card"
import { price } from "@/lib/intl"
import { AuctionReview } from "./AuctionReview"
import { AuctionTiming } from "./AuctionTiming"

export const AuctionSideCardAdmin = ({
  auction,
}: {
  auction: AuctionDetailAdmin
}) => {
  const highestBid = maxBy(auction.bids, (bid) => bid.amount) ?? null

  return (
    <Card className="lg:sticky lg:top-18">
      <CardContent className="flex flex-col gap-4">
        <AuctionTiming auction={auction} />

        <dl className="flex flex-col gap-1 border-t pt-3">
          <LabeledValue label="Starting price" dir="horizontal">
            {price.format(auction.startingPrice)}
          </LabeledValue>
          <LabeledValue label="Reserve price" dir="horizontal">
            {price.format(auction.reservePrice)}
          </LabeledValue>
          <LabeledValue label="Minimum increment" dir="horizontal">
            {price.format(auction.minIncrement)}
          </LabeledValue>
        </dl>

        {auction.status !== "SCHEDULED" && (
          <div className="border-t pt-3">
            <p className="text-sm text-muted-foreground">Highest bid</p>
            <p className="text-2xl font-semibold tabular-nums">
              {highestBid ? price.format(highestBid.amount) : "None"}
            </p>
            {highestBid &&
              (highestBid.amount >= auction.reservePrice ? (
                <p className="text-xs font-medium text-green-700 dark:text-green-300">
                  Reserve met
                </p>
              ) : (
                <p className="text-xs font-medium text-red-700 dark:text-red-300">
                  {price.format(auction.reservePrice - highestBid.amount)} under
                  reserve
                </p>
              ))}
          </div>
        )}

        {auction.status === "ENDED" && auction.result === null && (
          <AuctionReview auction={auction} highestBid={highestBid} />
        )}
      </CardContent>
    </Card>
  )
}
