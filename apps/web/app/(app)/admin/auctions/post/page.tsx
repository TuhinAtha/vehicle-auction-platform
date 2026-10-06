import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { CreateAuctionForm } from "@/features/auctions"
import { loadNewAuctionSearchParams } from "@/features/auctions/searchParams"
import { RECENT_VEHICLES_LIMIT } from "@/features/vehicles/data/constants"
import { fetchVehicle } from "@/features/vehicles/server/fetchVehicle"
import { fetchVehicles } from "@/features/vehicles/server/fetchVehicles"
import type { SearchParams } from "@/types/next"

export default async function NewAuctionPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { vehicleId } = await loadNewAuctionSearchParams(searchParams)
  const vehicle = vehicleId ? await fetchVehicle(vehicleId) : undefined
  const presetVehicle =
    vehicle?.availability === "AVAILABLE" ? vehicle : undefined
  const recentVehicles = presetVehicle
    ? undefined
    : await fetchVehicles({
        availability: "AVAILABLE",
        limit: RECENT_VEHICLES_LIMIT,
      }).catch(() => undefined)

  return (
    <Page>
      <PageHeader
        breadcrumbs={[{ label: "Auctions" }, { label: "New auction" }]}
      />
      <PageContent>
        <CreateAuctionForm
          vehicle={presetVehicle}
          recentVehicles={recentVehicles}
        />
      </PageContent>
    </Page>
  )
}
