import type { AuctionSummaryAdmin, AuctionSummaryDealer } from "@repo/shared"
import Link from "next/link"

import { useUser } from "@/providers/UserProvider"
import { serializeAuctionsSearchParams } from "../searchParams"
import type { AuctionsQueryParams, AuctionSummary } from "../types"
import { AuctionCardAdmin } from "./AuctionCardAdmin"
import { AuctionCardDealer } from "./AuctionCardDealer"

export const AuctionCardGrid = ({
  auctions,
  phase,
}: {
  auctions: AuctionSummary[]
  phase: AuctionsQueryParams["phase"]
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
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {auctions.map((auction) => (
        <li key={auction.id}>
          {role === "DEALER" ? (
            <Link
              href={serializeAuctionsSearchParams(
                `/dealer/auctions/${auction.id}`,
                { phase }
              )}
            >
              <AuctionCardDealer auction={auction as AuctionSummaryDealer} />
            </Link>
          ) : (
            <Link
              href={serializeAuctionsSearchParams(
                `/admin/auctions/${auction.id}`,
                { phase }
              )}
            >
              <AuctionCardAdmin auction={auction as AuctionSummaryAdmin} />
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}
