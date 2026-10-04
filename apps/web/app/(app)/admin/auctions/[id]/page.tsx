import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { notFound } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { AuctionDetailContainer } from "@/features/auctions"
import { getAuctionQuery } from "@/features/auctions/data/queries"
import { prefetchAuction } from "@/features/auctions/server/prefetchAuction"
import { getQueryClient } from "@/lib/query-client"

export default async function AdminAuctionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const queryClient = getQueryClient()
  await prefetchAuction(queryClient, id)

  if (!queryClient.getQueryData(getAuctionQuery(id).queryKey)) {
    notFound()
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <h1 className="text-lg font-semibold">Auction</h1>
        </PageHeader>
        <PageContent>
          <AuctionDetailContainer id={id} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
