"use client"

import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FormProvider } from "react-hook-form"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button, buttonVariants } from "@/components/ui/button"
import { ApiError } from "@/lib/http"
import { VehicleFields } from "@/features/vehicles/components/VehicleFields"
import { createVehicle } from "@/features/vehicles/data/mutations"
import { createAuction } from "../data/mutations"
import { AUCTION_QUERY_KEYS } from "../data/queryKeys"
import { useAuctionAndVehicleForm } from "../hooks/useAuctionAndVehicleForm"
import type { CreateAuctionFormValues } from "../lib/createAuctionFormSchema"
import { getRandomAuctionValues } from "../lib/getRandomAuctionValues"
import { AuctionFields } from "./AuctionFields"

const AUCTIONS_PATH = "/admin/auctions"

export const CreateAuctionForm = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const form = useAuctionAndVehicleForm()
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = form

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

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-3xl flex-col gap-4"
      >
        <VehicleFields />

        <AuctionFields />

        {errors.root && (
          <Alert variant="destructive">
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2">
          {process.env.NODE_ENV === "development" && (
            <Button
              type="button"
              variant="ghost"
              className="mr-auto"
              onClick={() => {
                setVehicleId(null)
                reset(getRandomAuctionValues())
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
    </FormProvider>
  )
}
