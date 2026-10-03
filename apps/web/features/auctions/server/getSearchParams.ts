import { AUCTION_PHASES, type AuctionPhase } from "@repo/shared"

const parsePhase = (value: unknown): AuctionPhase | undefined =>
  AUCTION_PHASES.find((phase) => phase === value)

import type { SearchParams } from "@/types/next"

export const getSearchParams = async (
  searchParams: SearchParams
): Promise<{ phase?: AuctionPhase }> => {
  const awaitedSearchParams = await searchParams
  const phase = parsePhase(awaitedSearchParams["phase"])
  return { phase }
}
