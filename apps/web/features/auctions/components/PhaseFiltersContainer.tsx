"use client"

import type { AuctionPhase } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { sumBy } from "es-toolkit"

import { AUCTION_PHASE_LABEL } from "@/constants/auction.constant"
import { getAuctionPhaseCountsQuery } from "@/features/auctions/data/queries"
import { PhaseFilter } from "@/features/auctions/components/PhaseFilter"

type PhaseFiltersContainerProps = {
  items: AuctionPhase[]
}
export const PhaseFiltersContainer = ({
  items,
}: PhaseFiltersContainerProps) => {
  const { data: counts } = useQuery(getAuctionPhaseCountsQuery())

  if (!counts) return null

  return (
    <nav aria-label="Auction phase" className="flex flex-wrap gap-2">
      <PhaseFilter
        key="all"
        text="All"
        count={sumBy(items, (phase) => counts[phase] ?? 0)}
      />
      {items
        .filter((phase) => counts[phase] !== undefined)
        .map((phase) => (
          <PhaseFilter
            key={phase}
            text={AUCTION_PHASE_LABEL[phase]}
            phase={phase}
            count={counts[phase] ?? 0}
          />
        ))}
    </nav>
  )
}
