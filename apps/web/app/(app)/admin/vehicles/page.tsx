import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import Link from "next/link"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { buttonVariants } from "@/components/ui/button"
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
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Vehicles</h1>
            <Link href="/admin/vehicles/post" className={buttonVariants()}>
              New vehicle
            </Link>
          </div>
        </PageHeader>
        <PageContent>
          <VehiclesContainer />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
