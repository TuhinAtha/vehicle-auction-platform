import type { AuctionDetailDealer } from "@repo/shared"

import { AuctionDetailLayout } from "./AuctionDetailLayout"
import { AuctionSideCardDealer } from "./AuctionSideCardDealer"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { BidStatusBadge } from "./BidStatusBadge"

export const AuctionDetailViewDealer = ({
  auction,
}: {
  auction: AuctionDetailDealer
}) => (
  <AuctionDetailLayout
    vehicle={auction.vehicle}
    badge={
      auction.bidStatus ? (
        <BidStatusBadge status={auction.bidStatus} />
      ) : (
        <AuctionStatusBadge status={auction.status} />
      )
    }
    sideCard={<AuctionSideCardDealer auction={auction} />}
  />
)
