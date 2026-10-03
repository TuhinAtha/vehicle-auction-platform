"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export const NavLink = ({
  href,
  exact = false,
  children,
}: {
  href: string
  /** Only active on `href` itself, not on its subpaths. */
  exact?: boolean
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const isActive =
    pathname === href || (!exact && pathname.startsWith(`${href}/`))

  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        active={isActive}
        render={<Link href={href} />}
        className="px-3 font-medium text-muted-foreground data-active:text-foreground"
      >
        {children}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
