import {
  AUCTION_PENDING_BADGE,
  AUCTION_RESULT_BADGE,
} from "@/constants/auction.constant"
import { AuctionResult } from "@repo/shared"
import { Badge } from "@/components/ui/badge"

export const AuctionResultBadge = ({
  result,
}: {
  result: AuctionResult | null
}) => {
  const { label, className } = result
    ? AUCTION_RESULT_BADGE[result]
    : AUCTION_PENDING_BADGE
  return <Badge className={className}>{label}</Badge>
}
