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
  photos: string[]
  city: string
  country: string
  createdAt: string
  updatedAt: string
}

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>

export const AUCTION_STATUSES = ['SCHEDULED', 'LIVE', 'ENDED'] as const
export type AuctionStatus = (typeof AUCTION_STATUSES)[number]

export const AUCTION_RESULTS = ['SOLD', 'UNSOLD'] as const
export type AuctionResult = (typeof AUCTION_RESULTS)[number]

export interface Auction {
  id: string
  vehicleId: string
  startsAt: string // ISO 8601
  endsAt: string // ISO 8601
  /** Whole currency units */
  reservePrice: number
  /** Whole currency units */
  minIncrement: number
  status: AuctionStatus
  /** Set once the auction has ended */
  result: AuctionResult | null
  /** Set when the auction ends as SOLD */
  winningBidId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateAuctionInput = Pick<
  Auction,
  'vehicleId' | 'startsAt' | 'endsAt' | 'reservePrice' | 'minIncrement'
>
