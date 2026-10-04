import {
  int,
  pad,
  getRandomVehicleValues,
} from "@/features/vehicles/lib/getRandomVehicleValues"
import type { CreateAuctionFormValues } from "./createAuctionFormSchema"

const toDatetimeLocal = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}`

export function getRandomAuctionValues(): CreateAuctionFormValues {
  const startingPrice = int(30, 90) * 500

  const startsAt = new Date()
  startsAt.setHours(startsAt.getHours() + int(1, 48), 0, 0, 0)
  const endsAt = new Date(startsAt)
  endsAt.setHours(endsAt.getHours() + int(6, 72))

  return {
    ...getRandomVehicleValues(),
    startsAt: toDatetimeLocal(startsAt),
    endsAt: toDatetimeLocal(endsAt),
    startingPrice,
    reservePrice: startingPrice + int(4, 10) * 500,
    minIncrement: 250,
  }
}
