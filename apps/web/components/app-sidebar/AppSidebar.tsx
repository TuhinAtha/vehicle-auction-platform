"use client"

import {
  AUCTION_PHASES,
  BID_STATUSES,
  DEALER_AUCTION_PHASES,
  type UserRole,
} from "@repo/shared"
import { useQuery } from "@tanstack/react-query"
import {
  Car,
  Gavel,
  HandCoins,
  House,
  type LucideIcon,
  Zap,
} from "lucide-react"
import { cn } from "cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQueryState } from "nuqs"

import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  AUCTION_PHASE_BADGE_CLASS,
  AUCTION_PHASE_LABEL,
  BID_STATUS_BADGE,
} from "@/constants/auction.constant"
import { ROLE_HOME } from "@/constants/path.constant"
import {
  getAuctionPhaseCountsQuery,
  getBidStatusCountsQuery,
} from "@/features/auctions/data/queries"
import { useUser } from "@/providers/UserProvider"
import { LogoutButton } from "./LogoutButton"

type NavItem = {
  path: string
  text: string
  icon: LucideIcon
  exact?: boolean
  filters?: { phase: string; text: string; countClassName: string }[]
  counts?: "auctionPhases" | "bidStatuses"
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { path: "/admin", text: "Home", icon: House, exact: true },
    {
      path: "/admin/auctions",
      text: "Auctions",
      icon: Gavel,
      filters: AUCTION_PHASES.map((phase) => ({
        phase,
        text: AUCTION_PHASE_LABEL[phase],
        countClassName: AUCTION_PHASE_BADGE_CLASS[phase],
      })),
      counts: "auctionPhases",
    },
    { path: "/admin/vehicles", text: "Vehicles", icon: Car },
  ],
  DEALER: [
    { path: "/dealer", text: "Home", icon: House, exact: true },
    {
      path: "/dealer/auctions",
      text: "Auctions",
      icon: Gavel,
      filters: DEALER_AUCTION_PHASES.map((phase) => ({
        phase,
        text: AUCTION_PHASE_LABEL[phase],
        countClassName: AUCTION_PHASE_BADGE_CLASS[phase],
      })),
      counts: "auctionPhases",
    },
    {
      path: "/dealer/mybids",
      text: "My bids",
      icon: HandCoins,
      filters: BID_STATUSES.map((status) => ({
        phase: status,
        text: BID_STATUS_BADGE[status].label,
        countClassName: BID_STATUS_BADGE[status].className,
      })),
      counts: "bidStatuses",
    },
  ],
}

export const AppSidebar = ({ appName }: { appName?: string }) => {
  const pathname = usePathname()
  const user = useUser()
  const [currentPhase] = useQueryState("phase")
  const { data: auctionPhases } = useQuery(getAuctionPhaseCountsQuery())
  const { data: bidStatuses } = useQuery({
    ...getBidStatusCountsQuery(),
    enabled: user.role === "DEALER",
  })
  const countsBySource: Record<string, Record<string, number> | undefined> = {
    auctionPhases,
    bidStatuses,
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={ROLE_HOME[user.role]} />}
            >
              <Zap />
              <span className="font-semibold">{appName}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS[user.role].map(
              ({ path, text, icon: Icon, exact, filters, counts }) => {
                const isInSection =
                  pathname === path ||
                  (!exact && pathname.startsWith(`${path}/`))

                if (!filters) {
                  return (
                    <SidebarMenuItem key={path}>
                      <SidebarMenuButton
                        isActive={isInSection}
                        render={<Link href={path} />}
                      >
                        <Icon />
                        <span>{text}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const filterCounts = counts && countsBySource[counts]

                return (
                  <SidebarMenuItem key={path}>
                    <div className="flex h-8 items-center gap-2 px-2 text-sm font-medium [&>svg]:size-4">
                      <Icon />
                      <span>{text}</span>
                    </div>
                    <SidebarMenuSub>
                      {filters.map(({ phase, text, countClassName }) => (
                        <SidebarMenuSubItem key={phase}>
                          <SidebarMenuSubButton
                            isActive={isInSection && phase === currentPhase}
                            render={<Link href={`${path}?phase=${phase}`} />}
                          >
                            <span>{text}</span>
                            {filterCounts && (
                              <Badge
                                className={cn(
                                  "ml-auto tabular-nums",
                                  countClassName
                                )}
                              >
                                {filterCounts[phase] ?? 0}
                              </Badge>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                )
              }
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="grid px-2 text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
