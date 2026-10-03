import type { AuctionSummaryAdmin, AuctionSummaryDealer } from "@repo/shared"
import { useUser } from "@/providers/UserProvider"
import type { AuctionSummary } from "../types"
import { AuctionCardAdmin } from "./AuctionCardAdmin"
import { AuctionCardDealer } from "./AuctionCardDealer"

export const AuctionCardGrid = ({
  auctions,
}: {
  auctions: AuctionSummary[]
}) => {
  const { role } = useUser()

  if (auctions.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No auctions to show.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auctions.map((auction) => (
        <li key={auction.id}>
          {role === "DEALER" ? (
            <AuctionCardDealer auction={auction as AuctionSummaryDealer} />
          ) : (
            <AuctionCardAdmin auction={auction as AuctionSummaryAdmin} />
          )}
        </li>
      ))}
    </ul>
  )
}
