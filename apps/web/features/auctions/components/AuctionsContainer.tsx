"use client"

import type { AuctionPhase } from "@repo/shared"
import { useAuctions } from "@/features/auctions/hooks/useAuctions"
import { AuctionCardGrid } from "@/features/auctions/components/AuctionCardGrid"
import { AuctionList } from "@/features/auctions/components/AuctionList"
import { useMemo } from "react"

type AuctionsContainerProps = {
  phase?: AuctionPhase
  displayMode?: "grid" | "list"
}
export const AuctionsContainer = ({
  phase,
  displayMode = "list",
}: AuctionsContainerProps) => {
  const Component = useMemo(
    () => (displayMode === "grid" ? AuctionCardGrid : AuctionList),
    [displayMode]
  )
  const { data, isPending, isError } = useAuctions({ phase })

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading auctions…</p>
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Couldn&apos;t load auctions. Please try again.
      </p>
    )
  }

  return <Component auctions={data} />
}
