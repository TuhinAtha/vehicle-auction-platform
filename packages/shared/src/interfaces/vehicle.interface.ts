import type { Auction } from './auction.interface'

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

/** GET /vehicles */
export interface VehicleSummary extends Vehicle {
  /** The auction that sold the vehicle, or its most recent UNSOLD one; none for UNLISTED */
  auction?: Auction & {
    maxBidAmount?: number
    winningBidAmount?: number
  }
}
