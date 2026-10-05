"use client"

import { LoadError } from "@/components/LoadError"
import { useAuctions } from "@/features/auctions/hooks/useAuctions"
import { AuctionCardGrid } from "@/features/auctions/components/AuctionCardGrid"
import type { AuctionsQueryParams } from "../types"

type AuctionsContainerProps = {
  queryParams: AuctionsQueryParams
}

export const AuctionsContainer = ({ queryParams }: AuctionsContainerProps) => {
  const { data, isPending, isError } = useAuctions(queryParams)

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading auctions…</p>
  }
  if (isError) {
    return <LoadError>Couldn&apos;t load auctions. Please try again.</LoadError>
  }

  return <AuctionCardGrid auctions={data} phase={queryParams.phase} />
}
