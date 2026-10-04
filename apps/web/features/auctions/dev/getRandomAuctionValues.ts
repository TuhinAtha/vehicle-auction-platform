import { faker } from "@faker-js/faker"

import type { AuctionFormValues } from "../lib/createAuctionFormSchema"

const HOUR = 3_600_000

const toDatetimeLocal = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16)

export function getRandomAuctionValues(): AuctionFormValues {
  const startingPrice = faker.number.int({ min: 30, max: 90 }) * 500

  const startsAt = faker.date.soon({ days: 2 })
  startsAt.setHours(startsAt.getHours() + 1, 0, 0, 0)
  const endsAt = new Date(
    startsAt.getTime() + faker.number.int({ min: 6, max: 72 }) * HOUR
  )

  return {
    startsAt: toDatetimeLocal(startsAt),
    endsAt: toDatetimeLocal(endsAt),
    startingPrice,
    reservePrice: startingPrice + faker.number.int({ min: 4, max: 10 }) * 500,
    minIncrement: 250,
  }
}
