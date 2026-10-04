import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { defaultVehicleValues } from "@/features/vehicles/data/defaultValues"
import { defaultAuctionValues } from "../data/defaultValues"
import {
  createAuctionFormSchema,
  type CreateAuctionFormValues,
} from "../lib/createAuctionFormSchema"

export const useAuctionAndVehicleForm = () => {
  return useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionFormSchema),
    defaultValues: {
      vehicleSource: "recent",
      vehicleId: "",
      ...defaultVehicleValues,
      ...defaultAuctionValues,
    },
  })
}
