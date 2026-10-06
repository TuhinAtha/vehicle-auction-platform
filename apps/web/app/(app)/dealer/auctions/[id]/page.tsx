import { type AuctionDetailDealer, DEALER_AUCTION_PHASES } from "@repo/shared"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound, redirect } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { DEALER_AUCTION_PHASE_LABEL } from "@/constants/auction.constant"
import { AuctionDetailContainer } from "@/features/auctions"
import { getAuctionQuery } from "@/features/auctions/data/queries"
import {
  loadAuctionsSearchParams,
  serializeAuctionsSearchParams,
  serializeMyBidsSearchParams,
} from "@/features/auctions/searchParams"
import { prefetchAuction } from "@/features/auctions/server/prefetchAuction"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function DealerAuctionPage({
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

  const { bidStatus } = auction as AuctionDetailDealer
  if (bidStatus) {
    redirect(
      serializeMyBidsSearchParams(`/dealer/mybids/${id}`, { phase: bidStatus })
    )
  }

  const phase =
    DEALER_AUCTION_PHASES.find(
      (dealerPhase) => dealerPhase === auction.status
    ) ?? null
  if (queryParams.phase !== phase) {
    redirect(serializeAuctionsSearchParams(`/dealer/auctions/${id}`, { phase }))
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "Auctions" },
            ...(phase
              ? [
                  {
                    label: DEALER_AUCTION_PHASE_LABEL[phase],
                    href: serializeAuctionsSearchParams("/dealer/auctions", {
                      phase,
                    }),
                  },
                ]
              : []),
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
