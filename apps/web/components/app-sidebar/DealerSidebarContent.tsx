"use client"

import { BID_STATUSES, DEALER_AUCTION_PHASES } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { Gavel, HandCoins, House } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

import { SidebarMenu } from "@/components/ui/sidebar"
import {
  AUCTION_PHASE_BADGE_CLASS,
  BID_STATUS_BADGE,
  DEALER_AUCTION_PHASE_LABEL,
} from "@/constants/auction.constant"
import {
  getAuctionPhaseCountsQuery,
  getBidStatusCountsQuery,
} from "@/features/auctions/data/queries"
import { NavGroup } from "./NavGroup"
import { NavLink } from "./NavLink"
import { NavSubLink } from "./NavSubLink"

export const DealerSidebarContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: phaseCounts } = useQuery(getAuctionPhaseCountsQuery())
  const { data: bidCounts } = useQuery(getBidStatusCountsQuery())

  const inAuctions = pathname.startsWith("/dealer/auctions")
  const inMyBids = pathname.startsWith("/dealer/mybids")
  const currentPhase = searchParams.get("phase")

  return (
    <SidebarMenu>
      <NavLink href="/dealer" icon={House} exact>
        Home
      </NavLink>
      <NavGroup icon={Gavel} label="Auctions">
        {DEALER_AUCTION_PHASES.map((phase) => (
          <NavSubLink
            key={phase}
            href={`/dealer/auctions?phase=${phase}`}
            isActive={inAuctions && currentPhase === phase}
            count={phaseCounts && (phaseCounts[phase] ?? 0)}
            countClassName={AUCTION_PHASE_BADGE_CLASS[phase]}
          >
            {DEALER_AUCTION_PHASE_LABEL[phase]}
          </NavSubLink>
        ))}
      </NavGroup>
      <NavGroup icon={HandCoins} label="My bids">
        {BID_STATUSES.map((status) => (
          <NavSubLink
            key={status}
            href={`/dealer/mybids?phase=${status}`}
            isActive={inMyBids && currentPhase === status}
            count={bidCounts && (bidCounts[status] ?? 0)}
            countClassName={BID_STATUS_BADGE[status].className}
          >
            {BID_STATUS_BADGE[status].label}
          </NavSubLink>
        ))}
      </NavGroup>
    </SidebarMenu>
  )
}
