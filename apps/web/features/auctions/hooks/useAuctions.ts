import type { AuctionPhase } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"

import { getAuctionsQuery } from "../data/queries"

export const useAuctions = ({ phase }: { phase?: AuctionPhase }) => {
  return useQuery(getAuctionsQuery({ searchParams: { phase } }))
}
