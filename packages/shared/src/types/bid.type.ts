import type { BID_STATUSES } from '../constants/bid.constant'
import type { Bid } from '../interfaces/bid.interface'

export type CreateBidInput = Pick<Bid, 'amount'>

export type BidStatus = (typeof BID_STATUSES)[number]

export type BidStatusCounts = Record<BidStatus, number>
