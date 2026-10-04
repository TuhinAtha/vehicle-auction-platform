import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import {
  MyBidPhaseFiltersContainer,
  MyBidsContainer,
} from "@/features/auctions"
import { prefetchMyBids } from "@/features/auctions/server/prefetchMyBids"
import { loadMyBidsSearchParams } from "@/features/auctions/searchParams"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function DealerMyBidsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const queryParams = await loadMyBidsSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchMyBids(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <h1 className="text-lg font-semibold">My bids</h1>
          <MyBidPhaseFiltersContainer />
        </PageHeader>
        <PageContent>
          <MyBidsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
