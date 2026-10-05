import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { CreateAuctionForm } from "@/features/auctions"
import { RECENT_VEHICLES_LIMIT } from "@/features/vehicles/data/constants"
import { prefetchAvailableVehicles } from "@/features/vehicles/server/prefetchAvailableVehicles"
import { getQueryClient } from "@/lib/query-client"

export default async function NewAuctionPage() {
  const queryClient = getQueryClient()
  await prefetchAvailableVehicles(queryClient, RECENT_VEHICLES_LIMIT)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[{ label: "Auctions" }, { label: "New auction" }]}
        />
        <PageContent>
          <CreateAuctionForm />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
