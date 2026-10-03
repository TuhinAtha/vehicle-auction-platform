import type { Auction } from "@repo/shared"
import { AuctionResultBadge } from "./AuctionResultBadge"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { price } from "@/lib/price"
import { getTimingLabel } from "../lib/getTimingLabel"

/** The date that matters for the auction's current status. */

export const AuctionListItem = ({ auction }: { auction: Auction }) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2">
          {auction.status === "ENDED" ? (
            <AuctionResultBadge result={auction.result} />
          ) : (
            <AuctionStatusBadge status={auction.status} />
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          Vehicle{" "}
          <span className="font-mono">{auction.vehicleId.slice(0, 8)}</span>
        </p>
        <p className="text-sm">{getTimingLabel(auction)}</p>
      </div>

      <dl className="flex gap-6 text-sm sm:text-right">
        <div>
          <dt className="text-muted-foreground">Reserve</dt>
          <dd className="font-medium tabular-nums">
            {price.format(auction.reservePrice)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Min. increment</dt>
          <dd className="font-medium tabular-nums">
            {price.format(auction.minIncrement)}
          </dd>
        </div>
      </dl>
    </div>
  )
}
