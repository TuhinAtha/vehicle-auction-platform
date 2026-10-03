import type { Auction } from "@repo/shared"
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
