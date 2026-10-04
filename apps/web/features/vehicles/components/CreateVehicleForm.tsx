"use client"

import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormProvider } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiError } from "@/lib/http"
import { createVehicle } from "../data/mutations"
import { VEHICLE_QUERY_KEYS } from "../data/queryKeys"
import { FillRandomVehicleButton } from "../dev/FillRandomVehicleButton"
import { useVehicleForm } from "../hooks/useVehicleForm"
import type { VehicleFormValues } from "../lib/vehicleFormSchema"
import { VehicleFields } from "./VehicleFields"

const VEHICLES_PATH = "/admin/vehicles"

export const CreateVehicleForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useVehicleForm()
  const {
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      await createVehicle(values)
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
      return
    }

    await queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all })
    router.push(VEHICLES_PATH)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-3xl flex-col gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleFields />
          </CardContent>
        </Card>

        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <FillRandomVehicleButton />
          <Link
            href={VEHICLES_PATH}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create vehicle"}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
