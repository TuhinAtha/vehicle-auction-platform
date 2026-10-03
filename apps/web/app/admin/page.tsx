import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { PageContent } from "@/components/page-content"
import { PhaseFiltersContainer, AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import { getSearchParams } from "@/features/auctions/server/getSearchParams"

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { phase } = await getSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchAuctions(queryClient, { phase })

  return (
    <PageContent>
      <h1 className="text-lg font-semibold">Auctions</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PhaseFiltersContainer />
        <AuctionsContainer phase={phase} />
      </HydrationBoundary>
    </PageContent>
  )
}
