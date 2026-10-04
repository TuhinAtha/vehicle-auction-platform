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
  startingPrice: number,
  reservePrice: number,
  status: AuctionStatus,
  result: AuctionResult | null = null,
) => ({
  vehicleId: vehicle.id,
  startsAt: hoursFromNow(startsInHours),
  endsAt: hoursFromNow(endsInHours),
  startingPrice,
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

    const [
      tesla,
      ioniq5,
      i4,
      zoe,
      polestar,
      id3,
      q4,
      ev6,
      eqa,
      enyaq,
      leaf,
      modelY,
    ] = await m.save(Vehicle, [
      ev('5YJ3E1EA7MF000001', 'Tesla', 'Model 3 Long Range', 2021, 'Berlin'),
      ev('KMHKN81AFNU000003', 'Hyundai', 'Ioniq 5', 2022, 'Hamburg'),
      ev('WBY71AW05PF000005', 'BMW', 'i4 eDrive40', 2023, 'Frankfurt'),
      ev('VF1AG000X66000006', 'Renault', 'Zoe R135', 2020, 'Stuttgart'),
      ev('YSMYKEAE5PB000007', 'Polestar', '2 Long Range', 2023, 'Düsseldorf'),
      ev('WVWZZZE1ZMP000008', 'Volkswagen', 'ID.3 Pro', 2021, 'München'),
      ev('WAUZZZGE5NB000009', 'Audi', 'Q4 e-tron 40', 2022, 'Köln'),
      ev('KNDC3DLC5N5000010', 'Kia', 'EV6 GT-Line', 2022, 'Leipzig'),
      ev('W1K2971231A000011', 'Mercedes-Benz', 'EQA 250', 2022, 'Dresden'),
      ev('TMBJC7NY5MF000012', 'Škoda', 'Enyaq iV 80', 2021, 'Hannover'),
      ev('1N4AZ1CP5JC000013', 'Nissan', 'Leaf e+', 2020, 'Bremen'),
      ev('LRW3E7FA4NC000014', 'Tesla', 'Model Y Performance', 2023, 'Nürnberg'),
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

    const [live, , sold, unsold, , , endingSoon, oneBidder, , , , review] =
      await m.save(Auction, [
        auction(tesla, -2, 4, 25000, 28000, 'LIVE'),
        auction(ioniq5, 24, 30, 27000, 30000, 'SCHEDULED'),
        auction(i4, -48, -42, 35000, 38000, 'ENDED', 'SOLD'),
        auction(zoe, -30, -24, 10000, 12000, 'ENDED', 'UNSOLD'),
        auction(polestar, -8, -1, 30000, 35000, 'ENDED'),
        // Live for another day, no bids yet
        auction(id3, -1, 26, 18000, 21000, 'LIVE'),
        // Live, ends in 30 minutes, reserve met
        auction(q4, -5, 0.5, 32000, 36000, 'LIVE'),
        // Live, only one dealer has bid
        auction(ev6, -3, 8, 30000, 33000, 'LIVE'),
        // Starts in 45 minutes
        auction(eqa, 0.75, 6.75, 29000, 32000, 'SCHEDULED'),
        // Starts in three days
        auction(enyaq, 72, 96, 26000, 29000, 'SCHEDULED'),
        // Ended without a single bid
        auction(leaf, -72, -66, 9000, 11000, 'ENDED', 'UNSOLD'),
        // Ended with the reserve met, result not decided yet
        auction(modelY, -6, -0.5, 42000, 45000, 'ENDED'),
      ])

    const [, , , winningBid] = await m.save(Bid, [
      bid(live, berlin, 25500, -1.5),
      bid(live, munich, 26500, -0.5),
      bid(sold, munich, 37000, -46),
      bid(sold, berlin, 39000, -43),
      bid(unsold, berlin, 10500, -26),
      bid(endingSoon, berlin, 33000, -4),
      bid(endingSoon, munich, 34500, -2.5),
      bid(endingSoon, berlin, 35500, -1),
      bid(endingSoon, munich, 36500, -0.25),
      bid(oneBidder, munich, 30500, -2),
      bid(review, berlin, 43000, -5),
      bid(review, munich, 44500, -3),
      bid(review, berlin, 46000, -1),
    ])
    await m.update(Auction, sold.id, { winningBidId: winningBid.id })
  })
  console.log('Database reset with demo vehicles, users, auctions and bids')
} finally {
  await app.close()
}
