import type { BidStatus } from "@repo/shared"

import { Badge } from "@/components/ui/badge"
import { BID_STATUS_BADGE } from "@/constants/auction.constant"

export const BidStatusBadge = ({ status }: { status: BidStatus }) => {
  const { label, className } = BID_STATUS_BADGE[status]

  return <Badge className={className}>{label}</Badge>
}
