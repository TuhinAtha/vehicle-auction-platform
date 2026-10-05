import { useQuery } from "@tanstack/react-query"
import type { AuctionsQueryParams } from "../types"

import { getAuctionsQuery } from "../data/queries"

export const useAuctions = (queryParams: AuctionsQueryParams) => {
  return useQuery(getAuctionsQuery({ queryParams }))
}
