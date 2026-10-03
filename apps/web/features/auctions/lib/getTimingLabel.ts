import type { Auction } from "@repo/shared"
import { datetime } from "@/lib/datetime"

export function getTimingLabel({ status, startsAt, endsAt }: Auction) {
  switch (status) {
    case "SCHEDULED":
      return `Starts ${datetime.format(new Date(startsAt))}`
    case "LIVE":
      return `Ends ${datetime.format(new Date(endsAt))}`
    case "ENDED":
      return `Ended ${datetime.format(new Date(endsAt))}`
  }
}
