"use client"

import { useVehicles } from "../hooks/useVehicles"
import { VehicleCardGrid } from "./VehicleCardGrid"

export const VehiclesContainer = () => {
  const { data, isPending, isError } = useVehicles()

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
