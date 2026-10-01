import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuctionsService } from '../auctions/auctions.service.js'
import { UsersService } from '../users/users.service.js'
import { CreateBidDto } from './dto/create-bid.dto.js'
import { Bid } from './entities/bid.entity.js'

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bids: Repository<Bid>,
    private readonly auctionsService: AuctionsService,
    private readonly usersService: UsersService,
  ) {}

  async create(auctionId: string, createBidDto: CreateBidDto) {
    await this.auctionsService.findOne(auctionId)
    await this.usersService.findOne(createBidDto.dealerId)
    return this.bids.save(this.bids.create({ ...createBidDto, auctionId }))
  }

  async findAllForAuction(auctionId: string) {
    await this.auctionsService.findOne(auctionId)
    return this.bids.find({
      where: { auctionId },
      order: { createdAt: 'DESC' },
    })
  }
}
