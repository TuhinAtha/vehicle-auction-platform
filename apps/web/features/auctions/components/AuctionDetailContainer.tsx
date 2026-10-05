"use client"

import { LoadError } from "@/components/LoadError"
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
      <LoadError>Couldn&apos;t load the auction. Please try again.</LoadError>
    )
  }

  return role === "ADMIN" ? (
    <AuctionDetailViewAdmin auction={auction as AuctionDetailAdmin} />
  ) : (
    <AuctionDetailViewDealer auction={auction as AuctionDetailDealer} />
  )
}
