"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { type RegisterOptions, useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/http"
import { createAuction, createVehicle } from "../data/mutations"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import {
  createAuctionFormSchema,
  type CreateAuctionFormValues,
} from "../lib/createAuctionFormSchema"
import { randomAuctionValues } from "../lib/randomAuctionValues"

const AUCTIONS_PATH = "/admin/auctions"

export const CreateAuctionForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAuctionFormValues>({
    resolver: zodResolver(createAuctionFormSchema),
    defaultValues: {
      vin: "",
      make: "",
      model: "",
      registrationDate: "",
      city: "",
      country: "DE",
      condition: "",
      startsAt: "",
      endsAt: "",
      minIncrement: 250,
    },
  })

  const onSubmit = async (values: CreateAuctionFormValues) => {
    try {
      let createdVehicleId = vehicleId
      if (!createdVehicleId) {
        createdVehicleId = (await createVehicle(values)).id
        setVehicleId(createdVehicleId)
      }
      await createAuction(createdVehicleId, values)
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
      return
    }

    await queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all })
    router.push(AUCTIONS_PATH)
  }

  const input = (
    name: keyof CreateAuctionFormValues,
    options?: RegisterOptions<CreateAuctionFormValues>
  ) => ({
    id: name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
    ...register(name, options),
  })
  const numeric = { valueAsNumber: true } as const

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex max-w-3xl flex-col gap-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
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
          <Field
            data-invalid={!!errors.registrationDate}
            className="sm:col-span-2"
          >
            <FieldLabel htmlFor="registrationDate">
              Registration date
            </FieldLabel>
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
            <FieldLabel htmlFor="batterySohPercent">
              Battery health (%)
            </FieldLabel>
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
        </CardContent>
      </Card>

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

          <Field
            data-invalid={!!errors.startingPrice}
            className="sm:col-span-2"
          >
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
            <FieldError
              id="reservePrice-error"
              errors={[errors.reservePrice]}
            />
          </Field>
          <Field data-invalid={!!errors.minIncrement} className="sm:col-span-2">
            <FieldLabel htmlFor="minIncrement">Min. increment (€)</FieldLabel>
            <Input type="number" {...input("minIncrement", numeric)} />
            <FieldError
              id="minIncrement-error"
              errors={[errors.minIncrement]}
            />
          </Field>
        </CardContent>
      </Card>

      {errors.root && (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        {process.env.NODE_ENV === "development" && (
          <Button
            type="button"
            variant="ghost"
            className="mr-auto"
            onClick={() => {
              setVehicleId(null)
              reset(randomAuctionValues())
            }}
          >
            Fill with random data
          </Button>
        )}
        <Link
          href={AUCTIONS_PATH}
          className={buttonVariants({ variant: "outline" })}
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating…" : "Create auction"}
        </Button>
      </div>
    </form>
  )
}
