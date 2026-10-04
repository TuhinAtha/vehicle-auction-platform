import type { Bid } from '../interfaces/bid.interface'

export type CreateBidInput = Pick<Bid, 'amount'>
