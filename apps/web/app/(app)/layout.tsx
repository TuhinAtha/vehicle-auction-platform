import { redirect } from "next/navigation"

import { LOGIN_PATH } from "@/constants/path.constant"
import { getSessionUser } from "@/lib/auth"
import { UserProvider } from "@/providers/UserProvider"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSessionUser()
  if (!user) redirect(LOGIN_PATH)

  return <UserProvider user={user}>{children}</UserProvider>
}
