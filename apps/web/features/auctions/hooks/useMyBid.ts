import { useQuery } from "@tanstack/react-query"

import { getMyBidQuery } from "../data/queries"

export const useMyBid = (id: string) => {
  return useQuery(getMyBidQuery(id))
}
