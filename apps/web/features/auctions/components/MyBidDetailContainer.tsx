"use client"

import { LoadError } from "@/components/LoadError"
import { useMyBid } from "../hooks/useMyBid"
import { AuctionDetailViewDealer } from "./AuctionDetailViewDealer"

export const MyBidDetailContainer = ({ id }: { id: string }) => {
  const { data: auction, isPending, isError } = useMyBid(id)

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading auction…</p>
  }
  if (isError) {
    return (
      <LoadError>Couldn&apos;t load the auction. Please try again.</LoadError>
    )
  }

  return <AuctionDetailViewDealer auction={auction} />
}
