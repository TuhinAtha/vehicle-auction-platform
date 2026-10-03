import type { Auction } from "@repo/shared"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { price } from "@/lib/price"
import { getTimingLabel } from "../lib/getTimingLabel"
import { AuctionResultBadge } from "./AuctionResultBadge"
import { AuctionStatusBadge } from "./AuctionStatusBadge"

export const AuctionCard = ({ auction }: { auction: Auction }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          {auction.status === "ENDED" ? (
            <AuctionResultBadge result={auction.result} />
          ) : (
            <AuctionStatusBadge status={auction.status} />
          )}
        </div>
        <CardTitle className="truncate">
          Vehicle{" "}
          <span className="font-mono">{auction.vehicleId.slice(0, 8)}</span>
        </CardTitle>
        <CardDescription>{getTimingLabel(auction)}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <dl className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Reserve</dt>
            <dd className="font-medium tabular-nums">
              {price.format(auction.reservePrice)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted-foreground">Min. increment</dt>
            <dd className="font-medium tabular-nums">
              {price.format(auction.minIncrement)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
