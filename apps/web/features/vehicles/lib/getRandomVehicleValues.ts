import type { VehicleFormValues } from "./vehicleFormSchema"

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

export const int = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
export const pick = <T>(items: T[]) => items[int(0, items.length - 1)]
export const pad = (value: number) => String(value).padStart(2, "0")

export function getRandomVehicleValues(): VehicleFormValues {
  const [make, model] = pick(MODELS)
  const year = int(2019, 2024)

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
  }
}
