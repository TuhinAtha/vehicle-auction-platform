import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Page } from "@/components/Page"
import { AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import {
  loadAuctionsSearchParams,
  serializeAuctionsSearchParams,
} from "@/features/auctions/searchParams"
import { PageHeader } from "@/components/PageHeader"
import { PageContent } from "@/components/PageContent"
import {
  AUCTION_PHASE_LABEL,
  DEFAULT_AUCTION_PHASE,
} from "@/constants/auction.constant"
import { redirect } from "next/navigation"
import { DEALER_AUCTION_PHASES } from "@repo/shared"

export default async function DealerAuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const loaded = await loadAuctionsSearchParams(searchParams)
  const phase = DEALER_AUCTION_PHASES.find(
    (dealerPhase) => dealerPhase === loaded.phase
  )
  if (!phase) {
    redirect(
      serializeAuctionsSearchParams("/dealer/auctions", {
        phase: DEFAULT_AUCTION_PHASE,
      })
    )
  }
  const queryParams = { phase }
  const queryClient = getQueryClient()
  await prefetchAuctions(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "Auctions" },
            { label: AUCTION_PHASE_LABEL[phase] },
          ]}
        />
        <PageContent>
          <AuctionsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
