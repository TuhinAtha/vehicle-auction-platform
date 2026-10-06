import { notFound, redirect } from "next/navigation"

import { Page } from "@/components/Page"
import { PageContent } from "@/components/PageContent"
import { PageHeader } from "@/components/PageHeader"
import { VEHICLE_AVAILABILITY_BADGE } from "@/constants/vehicle.constant"
import { VehicleDetailView } from "@/features/vehicles"
import {
  loadVehiclesSearchParams,
  serializeVehiclesSearchParams,
} from "@/features/vehicles/searchParams"
import { fetchVehicle } from "@/features/vehicles/server/fetchVehicle"
import type { SearchParams } from "@/types/next"

export default async function AdminVehiclePage({
  params,
  searchParams,
}: {
  params: Promise<{ vehicle: string }>
  searchParams: SearchParams
}) {
  const { vehicle: id } = await params
  const queryParams = await loadVehiclesSearchParams(searchParams)

  const vehicle = await fetchVehicle(id)
  if (!vehicle) notFound()

  const { availability } = vehicle
  if (queryParams.availability !== availability) {
    redirect(
      serializeVehiclesSearchParams(`/admin/vehicles/${id}`, { availability })
    )
  }

  return (
    <Page>
      <PageHeader
        breadcrumbs={[
          { label: "Vehicles" },
          {
            label: VEHICLE_AVAILABILITY_BADGE[availability].label,
            href: serializeVehiclesSearchParams("/admin/vehicles", {
              availability,
            }),
          },
          { label: `${vehicle.make} ${vehicle.model}` },
        ]}
      />
      <PageContent>
        <VehicleDetailView vehicle={vehicle} />
      </PageContent>
    </Page>
  )
}
