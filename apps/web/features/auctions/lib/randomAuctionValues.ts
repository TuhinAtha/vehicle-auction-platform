import type { CreateAuctionFormValues } from "./createAuctionFormSchema"

const VIN_CHARS = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789"
const MODELS = [
  ["Tesla", "Model 3 Long Range"],
  ["Hyundai", "Ioniq 5"],
  ["BMW", "i4 eDrive40"],
  ["Volkswagen", "ID.4 Pro"],
  ["Kia", "EV6 GT-Line"],
  ["Polestar", "2 Long Range"],
  ["Audi", "Q4 e-tron 40"],
  ["Škoda", "Enyaq iV 80"],
]
const CITIES = ["Berlin", "Hamburg", "München", "Köln", "Frankfurt", "Leipzig"]
const CONDITIONS = ["", "Good", "Very good", "Minor scratches on rear bumper"]

const int = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T>(items: T[]) => items[int(0, items.length - 1)]
const pad = (value: number) => String(value).padStart(2, "0")

/** The value format of `<input type="datetime-local">`, in local time. */
const toDatetimeLocal = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}`

/** Valid random values for the create-auction form, for quick manual testing. */
export function randomAuctionValues(): CreateAuctionFormValues {
  const [make, model] = pick(MODELS)
  const year = int(2019, 2024)
  const startingPrice = int(30, 90) * 500

  const startsAt = new Date()
  startsAt.setHours(startsAt.getHours() + int(1, 48), 0, 0, 0)
  const endsAt = new Date(startsAt)
  endsAt.setHours(endsAt.getHours() + int(6, 72))

  return {
    vin: Array.from({ length: 17 }, () => pick([...VIN_CHARS])).join(""),
    make,
    model,
    year,
    mileage: int(5, 120) * 1000,
    registrationDate: `${year}-${pad(int(1, 12))}-${pad(int(1, 28))}`,
    batteryCapacityKwh: int(500, 1000) / 10,
    batterySohPercent: int(85, 99),
    rangeKm: int(300, 550),
    city: pick(CITIES),
    country: "DE",
    condition: pick(CONDITIONS),
    startsAt: toDatetimeLocal(startsAt),
    endsAt: toDatetimeLocal(endsAt),
    startingPrice,
    reservePrice: startingPrice + int(4, 10) * 500,
    minIncrement: 250,
  }
}
