import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { BID_STATUS_BADGE } from "@/constants/auction.constant"
import { MyBidDetailContainer } from "@/features/auctions"
import { getMyBidQuery } from "@/features/auctions/data/queries"
import {
  loadMyBidsSearchParams,
  serializeMyBidsSearchParams,
} from "@/features/auctions/searchParams"
import { prefetchMyBid } from "@/features/auctions/server/prefetchMyBid"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function DealerMyBidPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: SearchParams
}) {
  const { id } = await params
  const { phase } = await loadMyBidsSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchMyBid(queryClient, id)

  const auction = queryClient.getQueryData(getMyBidQuery(id).queryKey)
  if (!auction) notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "My bids" },
            ...(phase
              ? [
                  {
                    label: BID_STATUS_BADGE[phase].label,
                    href: serializeMyBidsSearchParams("/dealer/mybids", {
                      phase,
                    }),
                  },
                ]
              : []),
            { label: `${auction.vehicle.make} ${auction.vehicle.model}` },
          ]}
        />
        <PageContent>
          <MyBidDetailContainer id={id} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
