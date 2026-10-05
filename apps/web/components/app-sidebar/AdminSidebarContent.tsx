"use client"

import { AUCTION_PHASES, VEHICLE_AVAILABILITIES } from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import { Car, Gavel, House } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"

import { SidebarMenu } from "@/components/ui/sidebar"
import {
  AUCTION_PHASE_BADGE_CLASS,
  AUCTION_PHASE_LABEL,
} from "@/constants/auction.constant"
import { VEHICLE_AVAILABILITY_BADGE } from "@/constants/vehicle.constant"
import { getAuctionPhaseCountsQuery } from "@/features/auctions/data/queries"
import { getVehicleAvailabilityCountsQuery } from "@/features/vehicles/data/queries"
import { NavGroup } from "./NavGroup"
import { NavLink } from "./NavLink"
import { NavSubLink } from "./NavSubLink"

export const AdminSidebarContent = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: phaseCounts } = useQuery(getAuctionPhaseCountsQuery())
  const { data: availabilityCounts } = useQuery(
    getVehicleAvailabilityCountsQuery()
  )

  const inAuctions = pathname.startsWith("/admin/auctions")
  const inVehicles = pathname.startsWith("/admin/vehicles")
  const currentPhase = searchParams.get("phase")
  const currentAvailability = searchParams.get("availability")

  return (
    <SidebarMenu>
      <NavLink href="/admin" icon={House} exact>
        Home
      </NavLink>
      <NavGroup icon={Gavel} label="Auctions">
        {AUCTION_PHASES.map((phase) => (
          <NavSubLink
            key={phase}
            href={`/admin/auctions?phase=${phase}`}
            isActive={inAuctions && currentPhase === phase}
            count={phaseCounts && (phaseCounts[phase] ?? 0)}
            countClassName={AUCTION_PHASE_BADGE_CLASS[phase]}
          >
            {AUCTION_PHASE_LABEL[phase]}
          </NavSubLink>
        ))}
      </NavGroup>
      <NavGroup icon={Car} label="Vehicles">
        {VEHICLE_AVAILABILITIES.map((availability) => (
          <NavSubLink
            key={availability}
            href={`/admin/vehicles?availability=${availability}`}
            isActive={inVehicles && currentAvailability === availability}
            count={availabilityCounts?.[availability]}
            countClassName={VEHICLE_AVAILABILITY_BADGE[availability].className}
          >
            {VEHICLE_AVAILABILITY_BADGE[availability].label}
          </NavSubLink>
        ))}
      </NavGroup>
    </SidebarMenu>
  )
}
