import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { redirect } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import {
  BID_STATUS_BADGE,
  DEFAULT_BID_STATUS,
} from "@/constants/auction.constant"
import { MyBidsContainer } from "@/features/auctions"
import { prefetchMyBids } from "@/features/auctions/server/prefetchMyBids"
import {
  loadMyBidsSearchParams,
  serializeMyBidsSearchParams,
} from "@/features/auctions/searchParams"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function DealerMyBidsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { phase } = await loadMyBidsSearchParams(searchParams)
  if (!phase) {
    redirect(
      serializeMyBidsSearchParams("/dealer/mybids", {
        phase: DEFAULT_BID_STATUS,
      })
    )
  }
  const queryParams = { phase }
  const queryClient = getQueryClient()
  await prefetchMyBids(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "My bids" },
            { label: BID_STATUS_BADGE[phase].label },
          ]}
        />
        <PageContent>
          <MyBidsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
