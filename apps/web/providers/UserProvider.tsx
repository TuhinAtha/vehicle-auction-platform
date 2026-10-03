"use client"

import type { AuthUser } from "@repo/shared"
import { createContext, use } from "react"

const UserContext = createContext<AuthUser | null>(null)

export const UserProvider = ({
  user,
  children,
}: Readonly<{
  user: AuthUser
  children: React.ReactNode
}>) => {
  return <UserContext value={user}>{children}</UserContext>
}

export function useUser() {
  const user = use(UserContext)
  if (!user) throw new Error("useUser must be used inside a UserProvider")
  return user
}
