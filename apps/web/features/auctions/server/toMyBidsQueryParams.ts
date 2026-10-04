import { BID_STATUSES } from "@repo/shared"

import { PHASE_QUERY_PARAM } from "@/constants/auction.constant"
import type { SearchParams } from "@/types/next"
import type { MyBidsQueryParams } from "../types"

export const toMyBidsQueryParams = async (
  searchParams: SearchParams
): Promise<MyBidsQueryParams> => {
  const queryParams = await searchParams
  const phase = BID_STATUSES.find(
    (status) => status === queryParams[PHASE_QUERY_PARAM]
  )
  return { phase }
}
