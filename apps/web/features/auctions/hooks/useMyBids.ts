import { useQuery } from "@tanstack/react-query"

import { getMyBidsQuery } from "../data/queries"
import type { MyBidsQueryParams } from "../types"

export const useMyBids = (queryParams: MyBidsQueryParams) => {
  return useQuery(getMyBidsQuery({ queryParams }))
}
