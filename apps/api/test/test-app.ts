import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { AuctionsModule } from '../src/auctions/auctions.module.js'
import { AuctionsService } from '../src/auctions/auctions.service.js'
import { Auction } from '../src/auctions/entities/auction.entity.js'
import { BidsModule } from '../src/bids/bids.module.js'
import { BidsService } from '../src/bids/bids.service.js'
import { Bid } from '../src/bids/entities/bid.entity.js'
import { User } from '../src/users/entities/user.entity.js'
import { Vehicle } from '../src/vehicles/entities/vehicle.entity.js'
import { prepareTestDatabase } from './database.js'
import { createFixtures } from './fixtures.js'

export async function createTestApp() {
  const connection = await prepareTestDatabase()

  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: connection.host,
        port: connection.port,
        username: connection.user,
        password: connection.password,
        database: connection.database,
        entities: [Vehicle, User, Auction, Bid],
        synchronize: true,
        dropSchema: true,
      }),
      AuctionsModule,
      BidsModule,
    ],
  }).compile()

  const dataSource = moduleRef.get(DataSource)

  return {
    auctions: moduleRef.get(AuctionsService),
    bids: moduleRef.get(BidsService),
    ...createFixtures(dataSource),

    reset() {
      return dataSource.query(
        'TRUNCATE "bids", "auctions", "vehicles", "users" CASCADE',
      )
    },

    close() {
      return moduleRef.close()
    },
  }
}
