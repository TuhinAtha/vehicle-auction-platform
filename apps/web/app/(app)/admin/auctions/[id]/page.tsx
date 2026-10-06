import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import type { AuctionDetailAdmin } from "@repo/shared"
import { notFound, redirect } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { AUCTION_PHASE_LABEL } from "@/constants/auction.constant"
import { AuctionDetailContainer } from "@/features/auctions"
import { getAuctionQuery } from "@/features/auctions/data/queries"
import { getAuctionPhase } from "@/features/auctions/lib/getAuctionPhase"
import {
  loadAuctionsSearchParams,
  serializeAuctionsSearchParams,
} from "@/features/auctions/searchParams"
import { prefetchAuction } from "@/features/auctions/server/prefetchAuction"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function AdminAuctionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: SearchParams
}) {
  const { id } = await params
  const queryParams = await loadAuctionsSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchAuction(queryClient, id)

  const auction = queryClient.getQueryData(getAuctionQuery(id).queryKey)
  if (!auction) notFound()

  const phase = getAuctionPhase(auction as AuctionDetailAdmin)
  if (queryParams.phase !== phase) {
    redirect(serializeAuctionsSearchParams(`/admin/auctions/${id}`, { phase }))
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "Auctions" },
            {
              label: AUCTION_PHASE_LABEL[phase],
              href: serializeAuctionsSearchParams("/admin/auctions", { phase }),
            },
            { label: `${auction.vehicle.make} ${auction.vehicle.model}` },
          ]}
        />
        <PageContent>
          <AuctionDetailContainer id={id} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
