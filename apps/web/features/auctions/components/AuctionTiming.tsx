import type { Auction } from "@repo/shared"

import { shortDatetime } from "@/lib/intl"
import { getTiming } from "../lib/getTimingLabel"
import { AuctionCountdown } from "./AuctionCountdown"

export const AuctionTiming = ({
  auction,
}: {
  auction: Pick<Auction, "status" | "startsAt" | "endsAt">
}) => {
  const timing = getTiming(auction)
  const startsAt = shortDatetime.format(new Date(auction.startsAt))
  const endsAt = shortDatetime.format(new Date(auction.endsAt))
  const isEnded = auction.status === "ENDED"

  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {isEnded ? timing.label : `${timing.label} in`}
      </p>
      <p className="text-2xl font-semibold tabular-nums">
        {isEnded ? (
          endsAt
        ) : (
          <AuctionCountdown to={timing.at} title={timing.date} />
        )}
      </p>
      <p className="text-xs text-muted-foreground">
        {startsAt} – {endsAt}
      </p>
    </div>
  )
}
