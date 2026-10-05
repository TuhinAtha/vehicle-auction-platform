import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar"

type NavGroupProps = {
  icon: LucideIcon
  label: string
  children: ReactNode
}

export const NavGroup = ({ icon: Icon, label, children }: NavGroupProps) => (
  <SidebarMenuItem>
    <div className="flex h-8 items-center gap-2 px-2 text-sm font-medium [&>svg]:size-4">
      <Icon />
      <span>{label}</span>
    </div>
    <SidebarMenuSub>{children}</SidebarMenuSub>
  </SidebarMenuItem>
)
