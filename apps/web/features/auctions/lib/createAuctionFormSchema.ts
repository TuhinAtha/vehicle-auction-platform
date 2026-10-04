import { z } from "zod"

import { vehicleFormSchema } from "@/features/vehicles/lib/vehicleFormSchema"

const wholeNumber = z.number("Enter a number.").int("Enter a whole number.")
const euros = wholeNumber.min(0, "Can't be negative.")

export const auctionFormSchema = z.object({
  startsAt: z.string().min(1, "Pick a start time."),
  endsAt: z.string().min(1, "Pick an end time."),
  startingPrice: euros,
  reservePrice: euros,
  minIncrement: wholeNumber.min(1, "Must be at least 1."),
})

const withRecentVehicle = auctionFormSchema.extend({
  vehicleSource: z.literal("recent"),
  vehicleId: z.string("Select a vehicle.").min(1, "Select a vehicle."),
})

const withNewVehicle = vehicleFormSchema
  .extend(auctionFormSchema.shape)
  .extend({
    vehicleSource: z.literal("new"),
  })

export const createAuctionFormSchema = z
  .discriminatedUnion("vehicleSource", [withRecentVehicle, withNewVehicle])
  .refine((values) => new Date(values.endsAt) > new Date(values.startsAt), {
    path: ["endsAt"],
    message: "Must be after the start.",
  })
  .refine((values) => values.reservePrice >= values.startingPrice, {
    path: ["reservePrice"],
    message: "Can't be below the starting price.",
  })

export type AuctionFormValues = z.infer<typeof auctionFormSchema>
export type CreateAuctionFormValues = z.infer<typeof createAuctionFormSchema>
