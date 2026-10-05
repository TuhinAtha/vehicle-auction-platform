import type { Auction } from '../interfaces/auction.interface'
import type { AuctionPhase } from '../types/auction.type'

export const AUCTION_STATUSES = ['SCHEDULED', 'LIVE', 'ENDED'] as const

export const AUCTION_RESULTS = ['SOLD', 'UNSOLD'] as const

export const AUCTION_PHASES = [
  'PENDING', // ENDED + NO RESULT
  'LIVE',
  'SCHEDULED',
  'SOLD', // ENDED + SOLD
  'UNSOLD', // ENDED + UNSOLD
] as const

export const DEALER_AUCTION_PHASES = [
  'SCHEDULED',
  'LIVE',
] as const satisfies readonly AuctionPhase[]

export const DEALER_AUCTION_EXCLUDED_FIELDS = [
  'reservePrice',
  'result',
  'winningBidId',
] as const satisfies readonly (keyof Auction)[]
