import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VehiclesModule } from '../vehicles/vehicles.module.js'
import { Auction } from './entities/auction.entity.js'
import { AuctionsService } from './auctions.service.js'
import { AuctionsController } from './auctions.controller.js'

@Module({
  imports: [TypeOrmModule.forFeature([Auction]), VehiclesModule],
  controllers: [AuctionsController],
  providers: [AuctionsService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
