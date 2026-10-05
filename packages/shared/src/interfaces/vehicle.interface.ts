export interface Vehicle {
  id: string
  vin: string
  make: string
  model: string
  year: number
  mileage: number
  batteryCapacityKwh: number
  batterySohPercent: number
  rangeKm: number
  registrationDate: string // YYYY-MM-DD
  condition: string | null
  /** Paths of uploaded photos, e.g. /uploads/vehicles/<id>.jpg */
  photos: string[]
  city: string
  country: string
  createdAt: string
  updatedAt: string
}
