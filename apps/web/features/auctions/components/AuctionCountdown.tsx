"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ComponentProps, useEffect } from "react"

import { Countdown } from "@/components/Countdown"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import { AUCTION_REFRESH_INTERVAL_MS } from "@/constants/auction.constant"

export const AuctionCountdown = (props: ComponentProps<typeof Countdown>) => {
  const queryClient = useQueryClient()
  const { to } = props

  // The API switches the status a few seconds after the time has passed.
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() >= new Date(to).getTime()) {
        queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all })
      }
    }, AUCTION_REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [to, queryClient])

  return <Countdown {...props} />
}
