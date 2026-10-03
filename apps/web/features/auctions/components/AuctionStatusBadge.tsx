import type { AuctionStatus } from "@repo/shared"
import { Badge } from "@/components/ui/badge"
import { AUCTION_STATUS_BADGE } from "@/constants/auction.constant"

export const AuctionStatusBadge = ({ status }: { status: AuctionStatus }) => {
  const { label, className } = AUCTION_STATUS_BADGE[status]

  return <Badge className={className}>{label}</Badge>
}
