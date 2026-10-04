import type { AuctionDetailDealer } from "@repo/shared"

import { AuctionDetailLayout } from "./AuctionDetailLayout"
import { AuctionSideCardDealer } from "./AuctionSideCardDealer"
import { AuctionStatusBadge } from "./AuctionStatusBadge"

export const AuctionDetailViewDealer = ({
  auction,
}: {
  auction: AuctionDetailDealer
}) => (
  <AuctionDetailLayout
    vehicle={auction.vehicle}
    badge={<AuctionStatusBadge status={auction.status} />}
    sideCard={<AuctionSideCardDealer auction={auction} />}
  />
)
