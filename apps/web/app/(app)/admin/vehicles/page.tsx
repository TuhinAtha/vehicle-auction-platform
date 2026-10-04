import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { VehiclesContainer } from "@/features/vehicles"
import { prefetchVehicles } from "@/features/vehicles/server/prefetchVehicles"
import { getQueryClient } from "@/lib/query-client"

export default async function AdminVehiclesPage() {
  const queryClient = getQueryClient()
  await prefetchVehicles(queryClient)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader>
          <h1 className="text-lg font-semibold">Vehicles</h1>
        </PageHeader>
        <PageContent>
          <VehiclesContainer />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
