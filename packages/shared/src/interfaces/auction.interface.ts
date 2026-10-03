import type { AuctionResult, AuctionStatus } from '../types/auction.type'

export interface Auction {
  id: string
  vehicleId: string
  startsAt: string // ISO 8601
  endsAt: string // ISO 8601
  /** Whole currency units */
  startingPrice: number
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
