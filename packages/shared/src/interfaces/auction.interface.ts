import type {
  AuctionResult,
  AuctionStatus,
  DealerAuctionExcludedField,
} from '../types/auction.type'
import type { BidStatus } from '../types/bid.type'
import type { Bid, BidWithDealer } from './bid.interface'
import type { Vehicle } from './vehicle.interface'

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

/** GET /auctions/:id as an admin. */
export interface AuctionDetailAdmin extends Auction {
  vehicle: Vehicle
  bids: BidWithDealer[]
  potentialWinningBid: BidWithDealer | null
}

/** GET /auctions/:id as a dealer: the excluded fields stay hidden. */
export interface AuctionDetailDealer extends Omit<
  Auction,
  DealerAuctionExcludedField
> {
  vehicle: Vehicle
  /** The dealer's own highest bid, if any */
  myBid: Bid | null
  /** The dealer's status on this auction; null if they have not bid */
  bidStatus: BidStatus | null
}

/** GET /auctions as an admin. */
export interface AuctionSummaryAdmin extends Auction {
  vehicle: Vehicle
  bidCount: number
  /** Highest bid amount, if any */
  maxBidAmount: number | null
}

/** GET /auctions as a dealer: the excluded fields stay hidden. */
export interface AuctionSummaryDealer extends Omit<
  Auction,
  DealerAuctionExcludedField
> {
  vehicle: Vehicle
}

export interface AuctionSummaryMyBid extends Omit<
  Auction,
  DealerAuctionExcludedField
> {
  vehicle: Vehicle
  myBidAmount: number
  bidStatus: BidStatus
}
