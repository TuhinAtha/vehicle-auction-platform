"use client"

import { QueryClientProvider } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/query-client"

export const QueryProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  // Not useState: if React suspends during the first render it would throw the
  // state away; getQueryClient() already returns a stable client in the browser.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
