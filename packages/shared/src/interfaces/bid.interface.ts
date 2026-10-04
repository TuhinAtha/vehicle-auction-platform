import type { User } from './user.interface'

export interface Bid {
  id: string
  auctionId: string
  dealerId: string
  /** Whole currency units */
  amount: number
  /** When the bid was placed */
  createdAt: string
}

export interface BidWithDealer extends Bid {
  dealer: User
}
