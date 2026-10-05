import { cn } from "cn"
import Link from "next/link"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavSubLinkProps = {
  href: string
  isActive: boolean
  count?: number
  countClassName?: string
  children: ReactNode
}

export const NavSubLink = ({
  href,
  isActive,
  count,
  countClassName,
  children,
}: NavSubLinkProps) => (
  <SidebarMenuSubItem>
    <SidebarMenuSubButton isActive={isActive} render={<Link href={href} />}>
      <span>{children}</span>
      {count !== undefined && (
        <Badge className={cn("ml-auto tabular-nums", countClassName)}>
          {count}
        </Badge>
      )}
    </SidebarMenuSubButton>
  </SidebarMenuSubItem>
)
