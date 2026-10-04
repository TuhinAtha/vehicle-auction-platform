"use client"

import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import type { CreateAuctionFormValues } from "../lib/createAuctionFormSchema"

export const FillRandomAuctionButton = () => {
  const { getValues, reset } = useFormContext<CreateAuctionFormValues>()

  if (process.env.NODE_ENV !== "development") return null

  const fillWithRandomData = async () => {
    const { getRandomAuctionValues } = await import("./getRandomAuctionValues")
    const values = getValues()

    if (values.vehicleSource === "recent") {
      reset({ ...values, ...getRandomAuctionValues() })
      return
    }

    const { getRandomVehicleValues } =
      await import("@/features/vehicles/dev/getRandomVehicleValues")
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
