"use client"

import Link from "next/link"

import { useMyBids } from "../hooks/useMyBids"
import type { MyBidsQueryParams } from "../types"
import { MyBidCard } from "./MyBidCard"

export const MyBidsContainer = ({
  queryParams,
}: {
  queryParams: MyBidsQueryParams
}) => {
  const { data, isPending, isError } = useMyBids(queryParams)

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading bids…</p>
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Couldn&apos;t load your bids. Please try again.
      </p>
    )
  }
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No bids to show.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((auction) => (
        <li key={auction.id}>
          <Link href={`/dealer/auctions/${auction.id}`}>
            <MyBidCard auction={auction} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
