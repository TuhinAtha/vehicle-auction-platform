"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { SidebarMenuButton } from "@/components/ui/sidebar"
import { LOGIN_PATH } from "@/constants/path.constant"

export const LogoutButton = () => {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleLogout() {
    setPending(true)
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    router.replace(LOGIN_PATH)
    router.refresh()
  }

  return (
    <SidebarMenuButton onClick={handleLogout} disabled={pending}>
      <LogOut />
      <span>{pending ? "Logging out…" : "Log out"}</span>
    </SidebarMenuButton>
  )
}
