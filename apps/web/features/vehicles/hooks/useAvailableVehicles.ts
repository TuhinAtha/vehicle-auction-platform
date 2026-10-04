import { useQuery } from "@tanstack/react-query"

import { getAvailableVehiclesQuery } from "../data/queries"

export const useAvailableVehicles = (limit?: number) => {
  return useQuery(getAvailableVehiclesQuery(limit))
}
