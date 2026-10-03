import { AUCTION_PHASES, type AuctionPhase } from "@repo/shared"

const parsePhase = (value: unknown): AuctionPhase | undefined =>
  AUCTION_PHASES.find((phase) => phase === value)

import type { SearchParams } from "@/types/next"
import { AuctionsQueryParams } from "../types"

export const toQueryParams = async (
  searchParams: SearchParams
): Promise<AuctionsQueryParams> => {
  const queryParams = await searchParams
  const phase = parsePhase(queryParams["phase"])
  return { phase }
}
