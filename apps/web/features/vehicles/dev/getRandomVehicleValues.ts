import { faker } from "@faker-js/faker"

import type { VehicleFormValues } from "../lib/vehicleFormSchema"

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

export function getRandomVehicleValues(): Omit<VehicleFormValues, "photos"> {
  const [make, model] = faker.helpers.arrayElement(MODELS)
  const registrationDate = faker.date
    .between({ from: "2019-01-01", to: "2024-12-31" })
    .toISOString()
    .slice(0, 10)

  return {
    vin: faker.vehicle.vin(),
    make,
    model,
    year: Number(registrationDate.slice(0, 4)),
    mileage: faker.number.int({ min: 5, max: 120 }) * 1000,
    registrationDate,
    batteryCapacityKwh: faker.number.float({
      min: 50,
      max: 100,
      fractionDigits: 1,
    }),
    batterySohPercent: faker.number.int({ min: 85, max: 99 }),
    rangeKm: faker.number.int({ min: 300, max: 550 }),
    city: faker.helpers.arrayElement(CITIES),
    country: "DE",
    condition: faker.helpers.arrayElement(CONDITIONS),
  }
}
