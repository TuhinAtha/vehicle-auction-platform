"use client"

import { type RegisterOptions, useFormContext } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { VehicleFormValues } from "../lib/vehicleFormSchema"
import { VehiclePhotosField } from "./VehiclePhotosField"

export const VehicleFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<VehicleFormValues>()

  const input = (
    name: keyof VehicleFormValues,
    options?: RegisterOptions<VehicleFormValues>
  ) => ({
    id: name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name, options),
  })
  const numeric = { valueAsNumber: true } as const

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field data-invalid={!!errors.vin} className="sm:col-span-3">
        <FieldLabel htmlFor="vin">VIN</FieldLabel>
        <Input {...input("vin")} />
        <FieldError id="vin-error" errors={[errors.vin]} />
      </Field>

      <Field data-invalid={!!errors.make}>
        <FieldLabel htmlFor="make">Make</FieldLabel>
        <Input {...input("make")} />
        <FieldError id="make-error" errors={[errors.make]} />
      </Field>
      <Field data-invalid={!!errors.model}>
        <FieldLabel htmlFor="model">Model</FieldLabel>
        <Input {...input("model")} />
        <FieldError id="model-error" errors={[errors.model]} />
      </Field>
      <Field data-invalid={!!errors.year}>
        <FieldLabel htmlFor="year">Year</FieldLabel>
        <Input type="number" {...input("year", numeric)} />
        <FieldError id="year-error" errors={[errors.year]} />
      </Field>

      <Field data-invalid={!!errors.mileage}>
        <FieldLabel htmlFor="mileage">Mileage (km)</FieldLabel>
        <Input type="number" {...input("mileage", numeric)} />
        <FieldError id="mileage-error" errors={[errors.mileage]} />
      </Field>
      <Field data-invalid={!!errors.registrationDate} className="sm:col-span-2">
        <FieldLabel htmlFor="registrationDate">Registration date</FieldLabel>
        <Input type="date" {...input("registrationDate")} />
        <FieldError
          id="registrationDate-error"
          errors={[errors.registrationDate]}
        />
      </Field>

      <Field data-invalid={!!errors.batteryCapacityKwh}>
        <FieldLabel htmlFor="batteryCapacityKwh">Capacity (kWh)</FieldLabel>
        <Input
          type="number"
          step="any"
          {...input("batteryCapacityKwh", numeric)}
        />
        <FieldError
          id="batteryCapacityKwh-error"
          errors={[errors.batteryCapacityKwh]}
        />
      </Field>
      <Field data-invalid={!!errors.batterySohPercent}>
        <FieldLabel htmlFor="batterySohPercent">Battery health (%)</FieldLabel>
        <Input
          type="number"
          step="any"
          {...input("batterySohPercent", numeric)}
        />
        <FieldError
          id="batterySohPercent-error"
          errors={[errors.batterySohPercent]}
        />
      </Field>
      <Field data-invalid={!!errors.rangeKm}>
        <FieldLabel htmlFor="rangeKm">Range (km)</FieldLabel>
        <Input type="number" step="any" {...input("rangeKm", numeric)} />
        <FieldError id="rangeKm-error" errors={[errors.rangeKm]} />
      </Field>

      <Field data-invalid={!!errors.city}>
        <FieldLabel htmlFor="city">City</FieldLabel>
        <Input {...input("city")} />
        <FieldError id="city-error" errors={[errors.city]} />
      </Field>
      <Field data-invalid={!!errors.country} className="sm:col-span-2">
        <FieldLabel htmlFor="country">Country</FieldLabel>
        <Input {...input("country")} />
        <FieldError id="country-error" errors={[errors.country]} />
      </Field>

      <Field data-invalid={!!errors.condition} className="sm:col-span-3">
        <FieldLabel htmlFor="condition">Condition (optional)</FieldLabel>
        <Input {...input("condition")} />
        <FieldError id="condition-error" errors={[errors.condition]} />
      </Field>

      <VehiclePhotosField />
    </div>
  )
}
