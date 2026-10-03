import type { Auction } from "@repo/shared"
import { datetime } from "@/lib/datetime"
import { AuctionListItem } from "./AuctionListItem"

export const AuctionList = ({ auctions }: { auctions: Auction[] }) => {
  if (auctions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No auctions to show.
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {auctions.map((auction) => (
        <li key={auction.id}>
          <AuctionListItem auction={auction} />
        </li>
      ))}
    </ul>
  )
}

/** The date that matters for the auction's current status. */
function timingLabel({ status, startsAt, endsAt }: Auction) {
  switch (status) {
    case "SCHEDULED":
      return `Starts ${datetime.format(new Date(startsAt))}`
    case "LIVE":
      return `Ends ${datetime.format(new Date(endsAt))}`
    case "ENDED":
      return `Ended ${datetime.format(new Date(endsAt))}`
  }
}
