// Dev-only: wipes every table and uploaded vehicle photo, then inserts a small demo dataset.
import { randomUUID } from 'node:crypto'
import { copyFileSync, mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { NestFactory } from '@nestjs/core'
import {
  type AuctionResult,
  type AuctionStatus,
  type CreateVehicleInput,
  VEHICLE_PHOTOS_PATH,
} from '@repo/shared'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module.js'
import { Auction } from './auctions/entities/auction.entity.js'
import { Bid } from './bids/entities/bid.entity.js'
import { User } from './users/entities/user.entity.js'
import { Vehicle } from './vehicles/entities/vehicle.entity.js'
import { UPLOADS_DIR } from './vehicles/vehicle-photo-upload.js'

if (process.env.NODE_ENV === 'production') {
  console.error('Refusing to reset the database: NODE_ENV is "production"')
  process.exit(1)
}

const MINUTE = 1 / 60
const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1000)

const SEED_PHOTOS_DIR = join(process.cwd(), 'seed-photos')
const VEHICLE_PHOTOS_DIR = join(UPLOADS_DIR, 'vehicles')

/** Copies seed-photos/<name>-1.jpg … <name>-<count>.jpg into the uploads folder. */
const photos = (name: string, count: number) =>
  Array.from({ length: count }, (_, index) => {
    const file = `${randomUUID()}.jpg`
    copyFileSync(
      join(SEED_PHOTOS_DIR, `${name}-${index + 1}.jpg`),
      join(VEHICLE_PHOTOS_DIR, file),
    )
    return `${VEHICLE_PHOTOS_PATH}/${file}`
  })

const ev = (
  vin: string,
  make: string,
  model: string,
  year: number,
  city: string,
  photos: string[] = [],
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
  photos,
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
    rmSync(VEHICLE_PHOTOS_DIR, { recursive: true, force: true })
    mkdirSync(VEHICLE_PHOTOS_DIR, { recursive: true })

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
      ev(
        '5YJ3E1EA7MF000001',
        'Tesla',
        'Model 3 Long Range',
        2021,
        'Berlin',
        photos('tesla-model-3', 3),
      ),
      ev(
        'KMHKN81AFNU000003',
        'Hyundai',
        'Ioniq 5',
        2022,
        'Hamburg',
        photos('hyundai-ioniq-5', 3),
      ),
      ev(
        'WBY71AW05PF000005',
        'BMW',
        'i4 eDrive40',
        2023,
        'Frankfurt',
        photos('bmw-i4', 3),
      ),
      ev(
        'VF1AG000X66000006',
        'Renault',
        'Zoe R135',
        2020,
        'Stuttgart',
        photos('renault-zoe', 1),
      ),
      ev(
        'YSMYKEAE5PB000007',
        'Polestar',
        '2 Long Range',
        2023,
        'Düsseldorf',
        photos('polestar-2', 3),
      ),
      ev(
        'WVWZZZE1ZMP000008',
        'Volkswagen',
        'ID.3 Pro',
        2021,
        'München',
        photos('vw-id3', 3),
      ),
      ev(
        'WAUZZZGE5NB000009',
        'Audi',
        'Q4 e-tron 40',
        2022,
        'Köln',
        photos('audi-q4-e-tron', 3),
      ),
      ev(
        'KNDC3DLC5N5000010',
        'Kia',
        'EV6 GT-Line',
        2022,
        'Leipzig',
        photos('kia-ev6', 3),
      ),
      ev(
        'W1K2971231A000011',
        'Mercedes-Benz',
        'EQA 250',
        2022,
        'Dresden',
        photos('mercedes-eqa', 3),
      ),
      ev(
        'TMBJC7NY5MF000012',
        'Škoda',
        'Enyaq iV 80',
        2021,
        'Hannover',
        photos('skoda-enyaq', 3),
      ),
      ev('1N4AZ1CP5JC000013', 'Nissan', 'Leaf e+', 2020, 'Bremen'),
      ev(
        'LRW3E7FA4NC000014',
        'Tesla',
        'Model Y Performance',
        2023,
        'Nürnberg',
        photos('tesla-model-y', 3),
      ),
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
        auction(tesla, -2, 5 * MINUTE, 25000, 28000, 'LIVE'),
        auction(ioniq5, 2 * MINUTE, 5 * MINUTE, 27000, 30000, 'SCHEDULED'),
        auction(i4, -48, -42, 35000, 38000, 'ENDED', 'SOLD'),
        auction(zoe, -30, -24, 10000, 12000, 'ENDED', 'UNSOLD'),
        auction(polestar, -8, -1, 30000, 35000, 'ENDED'),
        // Live, no bids yet
        auction(id3, -1, 4 * MINUTE, 18000, 21000, 'LIVE'),
        // Live, ends in a minute, reserve met
        auction(q4, -5, 1 * MINUTE, 32000, 36000, 'LIVE'),
        // Live, only one dealer has bid
        auction(ev6, -3, 3 * MINUTE, 30000, 33000, 'LIVE'),
        // Starts in a minute
        auction(eqa, 1 * MINUTE, 4 * MINUTE, 29000, 32000, 'SCHEDULED'),
        // Starts in three minutes
        auction(enyaq, 3 * MINUTE, 5 * MINUTE, 26000, 29000, 'SCHEDULED'),
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
