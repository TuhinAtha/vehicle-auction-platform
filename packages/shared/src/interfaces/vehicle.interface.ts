import type { VehicleAvailability } from '../types/vehicle.type'
import type { Auction } from './auction.interface'
import type { BidWithDealer } from './bid.interface'

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

export type VehicleAuction = Auction & {
  /** The highest bid, on a tie the earlier one; the winning bid when SOLD */
  highestBid: BidWithDealer | null
}

/** GET /vehicles */
export interface VehicleSummary extends Vehicle {
  /** The auction that sold the vehicle, else its open one, else its most recent */
  auction?: VehicleAuction
}

/** GET /vehicles/:id */
export interface VehicleDetail extends Vehicle {
  availability: VehicleAvailability
  /** The auctions of the vehicle in which it has been listed, newest first */
  auctions: VehicleAuction[]
}
