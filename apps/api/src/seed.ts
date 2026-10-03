// Dev-only: wipes every table and inserts a small demo dataset.
import { NestFactory } from '@nestjs/core'
import type {
  AuctionResult,
  AuctionStatus,
  CreateVehicleInput,
} from '@repo/shared'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module.js'
import { Auction } from './auctions/entities/auction.entity.js'
import { Bid } from './bids/entities/bid.entity.js'
import { User } from './users/entities/user.entity.js'
import { Vehicle } from './vehicles/entities/vehicle.entity.js'

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to reset the database: NODE_ENV is "production"')
  process.exit(1)
}

const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000)

const ev = (
  vin: string,
  make: string,
  model: string,
  year: number,
  city: string,
): CreateVehicleInput => ({
  vin,
  make,
  model,
  year,
  city,
  country: 'DE',
  mileage: (2025 - year) * 15000,
  batteryCapacityKwh: 75,
  batterySohPercent: 95,
  rangeKm: 450,
  registrationDate: `${year}-06-01`,
  condition: null,
  photos: [],
})

const auction = (
  vehicle: Vehicle,
  startsInHours: number,
  endsInHours: number,
  reservePrice: number,
  status: AuctionStatus,
  result: AuctionResult | null = null,
) => ({
  vehicleId: vehicle.id,
  startsAt: hoursFromNow(startsInHours),
  endsAt: hoursFromNow(endsInHours),
  reservePrice,
  minIncrement: 250,
  status,
  result,
})

const bid = (
  auction: Auction,
  dealer: User,
  amount: number,
  hours: number,
) => ({
  auctionId: auction.id,
  dealerId: dealer.id,
  amount,
  createdAt: hoursFromNow(hours),
})

const app = await NestFactory.createApplicationContext(AppModule, {
  logger: ['error', 'warn'],
})

try {
  const dataSource = app.get(DataSource)
  await dataSource.transaction(async (m) => {
    const tables = dataSource.entityMetadatas.map((e) => `"${e.tableName}"`)
    await m.query(`TRUNCATE ${tables.join(', ')} CASCADE`)

    const [tesla, ioniq5, i4, zoe, polestar] = await m.save(Vehicle, [
      ev('5YJ3E1EA7MF000001', 'Tesla', 'Model 3 Long Range', 2021, 'Berlin'),
      ev('KMHKN81AFNU000003', 'Hyundai', 'Ioniq 5', 2022, 'Hamburg'),
      ev('WBY71AW05PF000005', 'BMW', 'i4 eDrive40', 2023, 'Frankfurt'),
      ev('VF1AG000X66000006', 'Renault', 'Zoe R135', 2020, 'Stuttgart'),
      ev('YSMYKEAE5PB000007', 'Polestar', '2 Long Range', 2023, 'Düsseldorf'),
    ])

    const [, berlin, munich] = await m.save(User, [
      { email: 'admin@example.com', role: 'ADMIN', name: 'Anna Schmidt' },
      { email: 'berlin@example.com', role: 'DEALER', name: 'Autohaus Berlin' },
      {
        email: 'munich@example.com',
        role: 'DEALER',
        name: 'EV Motors München',
      },
    ])

    const [live, , sold, unsold] = await m.save(Auction, [
      auction(tesla, -2, 4, 28000, 'LIVE'),
      auction(ioniq5, 24, 30, 30000, 'SCHEDULED'),
      auction(i4, -48, -42, 38000, 'ENDED', 'SOLD'),
      auction(zoe, -30, -24, 12000, 'ENDED', 'UNSOLD'),
      auction(polestar, -8, -1, 35000, 'ENDED'),
    ])

    const bids = await m.save(Bid, [
      bid(live, berlin, 24000, -1.5),
      bid(live, munich, 25000, -0.5),
      bid(sold, munich, 37000, -46),
      bid(sold, berlin, 39000, -43),
      bid(unsold, berlin, 9500, -26),
    ])
    await m.update(Auction, sold.id, { winningBidId: bids[3].id })
  })
  console.log('Database reset with demo vehicles, users, auctions and bids')
} finally {
  await app.close()
}
