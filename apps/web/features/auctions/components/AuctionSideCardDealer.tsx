import type { AuctionDetailDealer } from "@repo/shared"

import { LabeledValue } from "@/components/LabeledValue"
import { Card, CardContent } from "@/components/ui/card"
import { price } from "@/lib/price"
import { AuctionTiming } from "./AuctionTiming"

export const AuctionSideCardDealer = ({
  auction,
}: {
  auction: AuctionDetailDealer
}) => (
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
      </dl>
    </CardContent>
  </Card>
)
