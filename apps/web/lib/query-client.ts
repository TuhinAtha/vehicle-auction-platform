import { isServer, QueryClient } from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data prefetched on the server shouldn't be refetched straight away
        // on the client after hydration.
        staleTime: 60 * 1000,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

/**
 * Server: a fresh client per request, so users never share cached data.
 * Browser: one client for the whole session, so the cache survives navigation.
 */
export function getQueryClient() {
  if (isServer) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
