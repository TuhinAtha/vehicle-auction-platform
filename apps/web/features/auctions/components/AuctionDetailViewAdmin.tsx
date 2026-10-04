import type { AuctionDetailAdmin } from "@repo/shared"

import { AuctionDetailLayout } from "./AuctionDetailLayout"
import { AuctionResultBadge } from "./AuctionResultBadge"
import { AuctionSideCardAdmin } from "./AuctionSideCardAdmin"
import { AuctionStatusBadge } from "./AuctionStatusBadge"
import { BidsTable } from "./BidsTable"

export const AuctionDetailViewAdmin = ({
  auction,
}: {
  auction: AuctionDetailAdmin
}) => (
  <AuctionDetailLayout
    vehicle={auction.vehicle}
    badge={
      auction.status === "ENDED" ? (
        <AuctionResultBadge result={auction.result} />
      ) : (
        <AuctionStatusBadge status={auction.status} />
      )
    }
    sideCard={<AuctionSideCardAdmin auction={auction} />}
  >
    {auction.status !== "SCHEDULED" && <BidsTable auction={auction} />}
  </AuctionDetailLayout>
)
