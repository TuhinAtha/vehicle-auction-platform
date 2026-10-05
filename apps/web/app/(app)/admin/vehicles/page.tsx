import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
  loadVehiclesSearchParams,
  serializeVehiclesSearchParams,
} from "@/features/vehicles/searchParams"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { buttonVariants } from "@/components/ui/button"
import {
  DEFAULT_VEHICLE_AVAILABILITY,
  VEHICLE_AVAILABILITY_BADGE,
} from "@/constants/vehicle.constant"
import { VehiclesContainer } from "@/features/vehicles"
import { prefetchVehicles } from "@/features/vehicles/server/prefetchVehicles"
import { getQueryClient } from "@/lib/query-client"
import type { SearchParams } from "@/types/next"

export default async function AdminVehiclesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { availability } = await loadVehiclesSearchParams(searchParams)
  if (!availability) {
    redirect(
      serializeVehiclesSearchParams("/admin/vehicles", {
        availability: DEFAULT_VEHICLE_AVAILABILITY,
      })
    )
  }
  const queryParams = { availability }

  const queryClient = getQueryClient()
  await prefetchVehicles(queryClient, queryParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Page>
        <PageHeader
          breadcrumbs={[
            { label: "Vehicles" },
            { label: VEHICLE_AVAILABILITY_BADGE[availability].label },
          ]}
        >
          <Link href="/admin/vehicles/post" className={buttonVariants()}>
            New vehicle
          </Link>
        </PageHeader>
        <PageContent>
          <VehiclesContainer queryParams={queryParams} />
        </PageContent>
      </Page>
    </HydrationBoundary>
  )
}
