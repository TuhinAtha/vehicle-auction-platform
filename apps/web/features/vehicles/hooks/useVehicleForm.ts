import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { defaultVehicleValues } from "../data/defaultValues"
import {
  vehicleFormSchema,
  type VehicleFormValues,
} from "../lib/vehicleFormSchema"

export const useVehicleForm = () => {
  return useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: defaultVehicleValues,
  })
}
