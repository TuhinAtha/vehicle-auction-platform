"use client"

import { AUCTION_PHASES } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"

import { AUCTION_PHASE_LABEL } from "@/constants/auction.constant"
import { getAuctionPhaseCountsQuery } from "@/features/auctions/data/queries"
import { PhaseFilter } from "@/features/auctions/components/PhaseFilter"

export const PhaseFiltersContainer = () => {
  const { data: counts } = useQuery(getAuctionPhaseCountsQuery())

  if (!counts) return null

  return (
    <nav aria-label="Auction phase" className="flex flex-wrap gap-2">
      <PhaseFilter
        key="all"
        text="All"
        count={AUCTION_PHASES.reduce(
          (sum, phase) => sum + (counts[phase] ?? 0),
          0
        )}
      />
      {AUCTION_PHASES.filter((phase) => counts[phase] !== undefined).map(
        (phase) => (
          <PhaseFilter
            key={phase}
            text={AUCTION_PHASE_LABEL[phase]}
            phase={phase}
            count={counts[phase] ?? 0}
          />
        )
      )}
    </nav>
  )
}
