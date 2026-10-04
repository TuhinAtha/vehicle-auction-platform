"use client"

import type { AuctionDetailAdmin, AuctionDetailDealer } from "@repo/shared"

import { useUser } from "@/providers/UserProvider"
import { useAuction } from "../hooks/useAuction"
import { AuctionDetailViewAdmin } from "./AuctionDetailViewAdmin"
import { AuctionDetailViewDealer } from "./AuctionDetailViewDealer"

export const AuctionDetailContainer = ({ id }: { id: string }) => {
  const { role } = useUser()
  const { data: auction, isPending, isError } = useAuction(id)

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading auction…</p>
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Couldn&apos;t load the auction. Please try again.
      </p>
    )
  }

  return role === "ADMIN" ? (
    <AuctionDetailViewAdmin auction={auction as AuctionDetailAdmin} />
  ) : (
    <AuctionDetailViewDealer auction={auction as AuctionDetailDealer} />
  )
}
