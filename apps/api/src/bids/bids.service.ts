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

  async create(auctionId: string, dealerId: string, amount: number) {
    const auction = await this.auctionsService.findOne(auctionId)
    if (auction.status !== 'LIVE' || auction.endsAt <= new Date()) {
      throw new ConflictException(
        `Auction ${auctionId} is not open for bidding`,
      )
    }

    // The minimum depends only on the dealer's own bids.
    const ownHighest = await this.bids.findOne({
      where: { auctionId, dealerId },
      order: { amount: 'DESC' },
    })
    const minimum = getMinimumBid(auction, ownHighest?.amount ?? null)
    if (amount < minimum) {
      throw new BadRequestException(`Bid must be at least ${minimum}`)
    }

    return this.bids.save(this.bids.create({ auctionId, dealerId, amount }))
  }
}
