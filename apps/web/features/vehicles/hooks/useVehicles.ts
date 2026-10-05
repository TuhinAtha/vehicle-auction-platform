import { useQuery } from "@tanstack/react-query"
import type { VehiclesQueryParams } from "../types"
import { getVehiclesQuery } from "../data/queries"

export const useVehicles = ({
  queryParams,
}: {
  queryParams: VehiclesQueryParams
}) => {
  return useQuery(getVehiclesQuery({ queryParams }))
}
