"use client"

import { useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import type { VehicleFormValues } from "../lib/vehicleFormSchema"
import { getRandomVehicleValues } from "./getRandomVehicleValues"

export const FillRandomVehicleButton = () => {
  const { getValues, reset } = useFormContext<VehicleFormValues>()

  if (process.env.NODE_ENV !== "development") return null

  return (
    <Button
      type="button"
      variant="ghost"
      className="mr-auto"
      onClick={() => reset({ ...getValues(), ...getRandomVehicleValues() })}
    >
      Fill with random data
    </Button>
  )
}
