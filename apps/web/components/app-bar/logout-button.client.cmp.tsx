"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
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
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={pending}>
      <LogOut />
      {pending ? "Logging out…" : "Log out"}
    </Button>
  )
}
