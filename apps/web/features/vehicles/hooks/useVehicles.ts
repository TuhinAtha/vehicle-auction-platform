import { useQuery } from "@tanstack/react-query"

import { getVehiclesQuery } from "../data/queries"

export const useVehicles = () => {
  return useQuery(getVehiclesQuery())
}
