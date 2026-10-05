import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LOGIN_PATH } from "@/constants/path.constant"
import { prefetchNavCounts } from "@/features/auctions/server/prefetchNavCounts"
import { getSessionUser } from "@/lib/auth"
import { getQueryClient } from "@/lib/query-client"
import { UserProvider } from "@/providers/UserProvider"

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getSessionUser()
  if (!user) redirect(LOGIN_PATH)

  const queryClient = getQueryClient()
  await prefetchNavCounts(queryClient, user.role)

  return (
    <UserProvider user={user}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarProvider open>
          <AppSidebar appName={process.env.WEB_APP_NAME} />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </HydrationBoundary>
    </UserProvider>
  )
}
