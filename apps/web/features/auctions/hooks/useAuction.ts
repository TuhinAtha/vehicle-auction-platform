import { useQuery } from "@tanstack/react-query"

import { getAuctionQuery } from "../data/queries"

export const useAuction = (id: string) => {
  return useQuery(getAuctionQuery(id))
}
