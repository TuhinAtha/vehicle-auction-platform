"use client"

import { LoadError } from "@/components/LoadError"
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
    return <LoadError>Couldn&apos;t load vehicles. Please try again.</LoadError>
  }

  return <VehicleCardGrid vehicles={data} />
}
