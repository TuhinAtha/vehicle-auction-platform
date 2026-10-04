import { prefetchAuctions } from "@/features/auctions/server/prefetchAuctions"
import type { SearchParams } from "@/types/next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { PageHeader } from "@/components/PageHeader"
import { AUCTION_PHASES } from "@repo/shared"
import { PhaseFiltersContainer, AuctionsContainer } from "@/features/auctions"
import { getQueryClient } from "@/lib/query-client"
import { loadAuctionsSearchParams } from "@/features/auctions/searchParams"
import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminAuctionsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const queryParams = await loadAuctionsSearchParams(searchParams)
  const queryClient = getQueryClient()
  await prefetchAuctions(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Auctions</h1>
            <Link href="/admin/auctions/post" className={buttonVariants()}>
              New auction
            </Link>
          </div>
          <PhaseFiltersContainer items={[...AUCTION_PHASES]} />
        </PageHeader>
        <PageContent>
          <AuctionsContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
