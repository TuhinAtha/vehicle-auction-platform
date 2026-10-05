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
        <PageHeader breadcrumbs={[{ label: "Vehicles" }]}>
          <Link href="/admin/vehicles/post" className={buttonVariants()}>
            New vehicle
          </Link>
        </PageHeader>
        <PageContent>
          <VehiclesContainer />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
