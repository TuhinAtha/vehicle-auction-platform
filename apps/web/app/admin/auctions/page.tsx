import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { PageHeader } from "@/components/PageHeader"
import { AUCTION_PHASES } from "@repo/shared"
import { PhaseFiltersContainer, AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import { getSearchParams } from "@/features/auctions/server/getSearchParams"
import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"

export default async function AdminAuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { phase } = await getSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchAuctions(queryClient, { phase })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <h1 className="text-lg font-semibold">Auctions</h1>
          <PhaseFiltersContainer items={[...AUCTION_PHASES]} />
        </PageHeader>
        <PageContent>
          <AuctionsContainer phase={phase} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
