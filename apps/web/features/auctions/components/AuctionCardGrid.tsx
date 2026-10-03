import type { Auction } from "@repo/shared"
import { AuctionCard } from "./AuctionCard"

export const AuctionCardGrid = ({ auctions }: { auctions: Auction[] }) => {
  if (auctions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No auctions to show.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <li key={auction.id}>
          <AuctionCard auction={auction} />
        </li>
      ))}
    </ul>
  )
}
