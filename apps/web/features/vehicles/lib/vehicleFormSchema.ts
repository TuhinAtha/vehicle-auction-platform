import { VEHICLE_PHOTO_MAX_COUNT } from "@repo/shared"
import { z } from "zod"

const text = z.string().trim().min(1, "Required.")
const number = z.number("Enter a number.")
const wholeNumber = number.int("Enter a whole number.")

export const vehicleFormSchema = z.object({
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "17 characters: A–Z and 0–9, without I, O or Q."
    ),
  make: text,
  model: text,
  year: wholeNumber
    .min(2000, "Must be 2000 or later.")
    .max(new Date().getFullYear() + 1, "Can't be that far in the future."),
  mileage: wholeNumber.min(0, "Can't be negative."),
  registrationDate: z.iso.date("Pick a date."),
  batteryCapacityKwh: number.positive("Must be more than 0."),
  batterySohPercent: number
    .min(0, "Must be between 0 and 100.")
    .max(100, "Must be between 0 and 100."),
  rangeKm: number
    .min(0, "Must be between 0 and 5000 km.")
    .max(5000, "Must be between 0 and 5000 km."),
  city: text,
  country: text,
  condition: z.string().trim(),
  photos: z.array(z.string()).max(VEHICLE_PHOTO_MAX_COUNT),
})

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>
