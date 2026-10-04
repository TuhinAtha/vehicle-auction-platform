"use client"

import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { getRandomVehicleValues } from "@/features/vehicles/dev/getRandomVehicleValues"
import type { CreateAuctionFormValues } from "../lib/createAuctionFormSchema"
import { getRandomAuctionValues } from "./getRandomAuctionValues"

export const FillRandomAuctionButton = () => {
  const { getValues, reset } = useFormContext<CreateAuctionFormValues>()

  if (process.env.NODE_ENV !== "development") return null

  const fillWithRandomData = () => {
    const values = getValues()

    if (values.vehicleSource === "recent") {
      reset({ ...values, ...getRandomAuctionValues() })
      return
    }

    reset({
      ...values,
      ...getRandomVehicleValues(),
      ...getRandomAuctionValues(),
    })
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className="mr-auto"
      onClick={fillWithRandomData}
    >
      Fill with random data
    </Button>
  )
}
