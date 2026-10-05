"use client"

import { useController } from "react-hook-form"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { distance } from "@/lib/intl"
import { RECENT_VEHICLES_LIMIT } from "../data/constants"
import { useVehicles } from "../hooks/useVehicles"

export const RecentVehicleCards = () => {
  const { field, fieldState } = useController<{ vehicleId: string }>({
    name: "vehicleId",
  })
  const { data, isPending, isError } = useVehicles({
    queryParams: { availability: "UNLISTED", limit: RECENT_VEHICLES_LIMIT },
  })

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
  if (data.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No vehicles available.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        value={field.value}
        onValueChange={field.onChange}
        aria-label="Vehicle"
        className="grid gap-4 sm:grid-cols-3"
      >
        {data.map((vehicle) => (
          <FieldLabel key={vehicle.id} htmlFor={vehicle.id}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  {vehicle.make} {vehicle.model}
                </FieldTitle>
                <FieldDescription>
                  {vehicle.year} - {vehicle.city}
                </FieldDescription>
                <FieldDescription>{vehicle.vin}</FieldDescription>
                <FieldDescription>
                  {distance.format(vehicle.mileage)}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={vehicle.id} id={vehicle.id} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      <FieldError errors={[fieldState.error]} />
    </div>
  )
}
