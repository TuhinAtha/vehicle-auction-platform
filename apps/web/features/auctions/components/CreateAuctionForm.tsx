"use client"

import type { Vehicle } from "@repo/shared"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider, useWatch } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiError } from "@/lib/http"
import { RecentVehicleCards } from "@/features/vehicles/components/RecentVehicleCards"
import { VehicleFields } from "@/features/vehicles/components/VehicleFields"
import { createVehicle } from "@/features/vehicles/data/mutations"
import { VEHICLE_QUERY_KEYS } from "@/features/vehicles/data/queryKeys"
import { createAuction } from "../data/mutations"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import { FillRandomAuctionButton } from "../dev/FillRandomAuctionButton"
import { useAuctionAndVehicleForm } from "../hooks/useAuctionAndVehicleForm"
import type { CreateAuctionFormValues } from "../lib/createAuctionFormSchema"
import { AuctionFields } from "./AuctionFields"

const AUCTIONS_PATH = "/admin/auctions"

export const CreateAuctionForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [createdVehicle, setCreatedVehicle] = useState<Vehicle | null>(null)
  const form = useAuctionAndVehicleForm()
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = form
  const vehicleSource = useWatch({ control, name: "vehicleSource" })

  const getVehicleId = async (values: CreateAuctionFormValues) => {
    if (values.vehicleSource === "recent") return values.vehicleId
    if (createdVehicle?.vin === values.vin) return createdVehicle.id

    const vehicle = await createVehicle(values)
    setCreatedVehicle(vehicle)
    return vehicle.id
  }

  const onSubmit = async (values: CreateAuctionFormValues) => {
    try {
      await createAuction(await getVehicleId(values), values)
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
      return
    }

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all }),
    ])
    router.push(AUCTIONS_PATH)
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
            <CardAction>
              <Tabs
                value={vehicleSource}
                onValueChange={(value) => setValue("vehicleSource", value)}
              >
                <TabsList>
                  <TabsTrigger value="recent">Recently added</TabsTrigger>
                  <TabsTrigger value="new">New vehicle</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardAction>
          </CardHeader>
          <CardContent>
            {vehicleSource === "recent" ? (
              <RecentVehicleCards />
            ) : (
              <VehicleFields />
            )}
          </CardContent>
        </Card>

        <AuctionFields />

        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          <FillRandomAuctionButton />
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
    </FormProvider>
  )
}
