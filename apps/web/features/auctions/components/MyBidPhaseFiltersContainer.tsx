"use client"

import { BID_STATUSES } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { sumBy } from "es-toolkit"

import { BID_STATUS_BADGE } from "@/constants/auction.constant"
import { getBidStatusCountsQuery } from "../data/queries"
import { PhaseFilter } from "./PhaseFilter"

export const MyBidPhaseFiltersContainer = () => {
  const { data: counts } = useQuery(getBidStatusCountsQuery())

  if (!counts) return null

  return (
    <nav aria-label="Bid status" className="flex flex-wrap gap-2">
      <PhaseFilter
        text="All"
        count={sumBy(BID_STATUSES, (status) => counts[status])}
      />
      {BID_STATUSES.map((status) => (
        <PhaseFilter
          key={status}
          text={BID_STATUS_BADGE[status].label}
          phase={status}
          count={counts[status]}
        />
      ))}
    </nav>
  )
}
