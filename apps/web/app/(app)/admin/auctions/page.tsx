import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { PageHeader } from "@/components/PageHeader"
import { AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import {
  loadAuctionsSearchParams,
  serializeAuctionsSearchParams,
} from "@/features/auctions/searchParams"
import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { buttonVariants } from "@/components/ui/button"
import {
  AUCTION_PHASE_LABEL,
  DEFAULT_AUCTION_PHASE,
} from "@/constants/auction.constant"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function AdminAuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { phase } = await loadAuctionsSearchParams(searchParams)
  if (!phase) {
    redirect(
      serializeAuctionsSearchParams("/admin/auctions", {
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
        >
          <Link href="/admin/auctions/post" className={buttonVariants()}>
            New auction
          </Link>
        </PageHeader>
        <PageContent>
          <AuctionsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
