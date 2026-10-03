import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { DEALER_AUCTION_PHASES } from "@repo/shared"
import { Page } from "@/components/Page"
import { PhaseFiltersContainer, AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import { toQueryParams } from "@/features/auctions/server/toQueryParams"
import { PageHeader } from "@/components/PageHeader"
import { PageContent } from "@/components/PageContent"

export default async function DealerAuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const queryParams = await toQueryParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchAuctions(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <h1 className="text-lg font-semibold">Auctions</h1>
          <PhaseFiltersContainer items={[...DEALER_AUCTION_PHASES]} />
        </PageHeader>
        <PageContent>
          <AuctionsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
