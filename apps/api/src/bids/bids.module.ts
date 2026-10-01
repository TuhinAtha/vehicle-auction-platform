import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuctionsModule } from '../auctions/auctions.module.js'
import { UsersModule } from '../users/users.module.js'
import { Bid } from './entities/bid.entity.js'
import { BidsService } from './bids.service.js'
import { BidsController } from './bids.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Bid]), AuctionsModule, UsersModule],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
