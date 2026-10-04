"use client"

import { type RegisterOptions, useFormContext } from "react-hook-form"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { AuctionFormValues } from "../lib/createAuctionFormSchema"

export const AuctionFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<AuctionFormValues>()

  const input = (
    name: keyof AuctionFormValues,
    options?: RegisterOptions<AuctionFormValues>
  ) => ({
    id: name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name, options),
  })
  const numeric = { valueAsNumber: true } as const

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-6">
        <Field data-invalid={!!errors.startsAt} className="sm:col-span-3">
          <FieldLabel htmlFor="startsAt">Starts</FieldLabel>
          <Input type="datetime-local" {...input("startsAt")} />
          <FieldError id="startsAt-error" errors={[errors.startsAt]} />
        </Field>
        <Field data-invalid={!!errors.endsAt} className="sm:col-span-3">
          <FieldLabel htmlFor="endsAt">Ends</FieldLabel>
          <Input type="datetime-local" {...input("endsAt")} />
          <FieldError id="endsAt-error" errors={[errors.endsAt]} />
        </Field>

        <Field data-invalid={!!errors.startingPrice} className="sm:col-span-2">
          <FieldLabel htmlFor="startingPrice">Starting price (€)</FieldLabel>
          <Input type="number" {...input("startingPrice", numeric)} />
          <FieldError
            id="startingPrice-error"
            errors={[errors.startingPrice]}
          />
        </Field>
        <Field data-invalid={!!errors.reservePrice} className="sm:col-span-2">
          <FieldLabel htmlFor="reservePrice">Reserve price (€)</FieldLabel>
          <Input type="number" {...input("reservePrice", numeric)} />
          <FieldError id="reservePrice-error" errors={[errors.reservePrice]} />
        </Field>
        <Field data-invalid={!!errors.minIncrement} className="sm:col-span-2">
          <FieldLabel htmlFor="minIncrement">Min. increment (€)</FieldLabel>
          <Input type="number" {...input("minIncrement", numeric)} />
          <FieldError id="minIncrement-error" errors={[errors.minIncrement]} />
        </Field>
      </CardContent>
    </Card>
  )
}
