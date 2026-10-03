"use client"

import type { AuctionPhase } from "@repo/shared"
import { useAuctions } from "@/features/auctions/hooks/useAuctions"
import { AuctionList } from "@/features/auctions/components/AuctionList"

export const AuctionsContainer = ({ phase }: { phase?: AuctionPhase }) => {
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
  return <AuctionList auctions={data} />
}
