import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getMinimumBid } from '@repo/shared'
import { Repository } from 'typeorm'
import { AuctionsService } from '../auctions/auctions.service.js'
import { Bid } from './entities/bid.entity.js'

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bids: Repository<Bid>,
    private readonly auctionsService: AuctionsService,
  ) {}

  /** A dealer's first bid on an auction: at least the starting price. */
  async place(auctionId: string, dealerId: string, amount: number) {
    const auction = await this.findOpenAuction(auctionId)
    const ownHighest = await this.findOwnHighest(auctionId, dealerId)
    if (ownHighest) {
      throw new ConflictException(
        'You already bid on this auction. Raise your bid instead.',
      )
    }

    return this.save(auctionId, dealerId, amount, getMinimumBid(auction, null))
  }

  /** A later bid: at least the dealer's own highest bid plus the increment. */
  async raise(auctionId: string, dealerId: string, amount: number) {
    const auction = await this.findOpenAuction(auctionId)
    const ownHighest = await this.findOwnHighest(auctionId, dealerId)
    if (!ownHighest) {
      throw new ConflictException(
        'You have not bid on this auction yet. Place a bid first.',
      )
    }

    return this.save(
      auctionId,
      dealerId,
      amount,
      getMinimumBid(auction, ownHighest.amount),
    )
  }

  private async findOpenAuction(auctionId: string) {
    const auction = await this.auctionsService.findOne(auctionId)
    if (auction.status !== 'LIVE' || auction.endsAt <= new Date()) {
      throw new ConflictException(
        `Auction ${auctionId} is not open for bidding`,
      )
    }
    return auction
  }

  private findOwnHighest(auctionId: string, dealerId: string) {
    return this.bids.findOne({
      where: { auctionId, dealerId },
      order: { amount: 'DESC' },
    })
  }

  private save(
    auctionId: string,
    dealerId: string,
    amount: number,
    minimum: number,
  ) {
    if (amount < minimum) {
      throw new BadRequestException(`Bid must be at least ${minimum}`)
    }
    return this.bids.save(this.bids.create({ auctionId, dealerId, amount }))
  }
}
