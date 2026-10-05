"use client"

import { Zap } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ROLE_HOME } from "@/constants/path.constant"
import { useUser } from "@/providers/UserProvider"
import { AdminSidebarContent } from "./AdminSidebarContent"
import { DealerSidebarContent } from "./DealerSidebarContent"
import { LogoutButton } from "./LogoutButton"

export const AppSidebar = ({ appName }: { appName?: string }) => {
  const user = useUser()

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
          {user.role === "ADMIN" ? (
            <AdminSidebarContent />
          ) : (
            <DealerSidebarContent />
          )}
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
