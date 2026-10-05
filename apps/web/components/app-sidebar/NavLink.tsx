"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

type NavLinkProps = {
  href: string
  icon: LucideIcon
  exact?: boolean
  children: ReactNode
}

export const NavLink = ({
  href,
  icon: Icon,
  exact,
  children,
}: NavLinkProps) => {
  const pathname = usePathname()
  const isActive =
    pathname === href || (!exact && pathname.startsWith(`${href}/`))

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} render={<Link href={href} />}>
        <Icon />
        <span>{children}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
