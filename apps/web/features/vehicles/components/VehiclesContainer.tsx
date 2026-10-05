"use client"

import { useVehicles } from "../hooks/useVehicles"
import { VehiclesQueryParams } from "../types"
import { VehicleCardGrid } from "./VehicleCardGrid"

type VehiclesContainerProps = {
  queryParams: VehiclesQueryParams
}
export const VehiclesContainer = ({ queryParams }: VehiclesContainerProps) => {
  const { data, isPending, isError } = useVehicles({ queryParams })

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading vehicles…</p>
  }
  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
        Couldn&apos;t load vehicles. Please try again.
      </p>
    )
  }

  return <VehicleCardGrid vehicles={data} />
}
