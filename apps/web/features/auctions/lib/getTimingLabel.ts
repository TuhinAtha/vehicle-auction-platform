import type { Auction } from "@repo/shared"
import { datetime } from "@/lib/datetime"

type Timing = Pick<Auction, "status" | "startsAt" | "endsAt">

/** The date that matters for the auction's current status, with its label. */
export function getTiming({ status, startsAt, endsAt }: Timing) {
  switch (status) {
    case "SCHEDULED":
      return { label: "Starts", date: datetime.format(new Date(startsAt)) }
    case "LIVE":
      return { label: "Ends", date: datetime.format(new Date(endsAt)) }
    case "ENDED":
      return { label: "Ended", date: datetime.format(new Date(endsAt)) }
  }
}

export function getTimingLabel(auction: Timing) {
  const { label, date } = getTiming(auction)
  return `${label} ${date}`
}
