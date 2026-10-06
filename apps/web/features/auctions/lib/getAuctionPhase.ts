import type { Auction, AuctionPhase } from "@repo/shared"

export function getAuctionPhase({
  status,
  result,
}: Pick<Auction, "status" | "result">): AuctionPhase {
  if (status !== "ENDED") return status
  return result ? "COMPLETED" : "PENDING"
}
