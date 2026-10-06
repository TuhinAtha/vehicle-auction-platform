"use client"

import { LoadError } from "@/components/LoadError"
import type { VehicleSummary } from "@repo/shared"
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

export const RecentVehicleCards = ({
  vehicles,
}: {
  vehicles?: VehicleSummary[]
}) => {
  const { field, fieldState } = useController<{ vehicleId: string }>({
    name: "vehicleId",
  })

  if (!vehicles) {
    return <LoadError>Couldn&apos;t load vehicles. Please try again.</LoadError>
  }
  if (vehicles.length === 0) {
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
        {vehicles.map((vehicle) => (
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
