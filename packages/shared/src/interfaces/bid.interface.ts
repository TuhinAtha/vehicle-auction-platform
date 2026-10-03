export interface Bid {
  id: string
  auctionId: string
  dealerId: string
  /** Whole currency units */
  amount: number
  /** When the bid was placed */
  createdAt: string
}
