import type { AuctionStatus } from '@repo/shared'
import type { DataSource } from 'typeorm'
import { Auction } from '../src/auctions/entities/auction.entity.js'
import { Bid } from '../src/bids/entities/bid.entity.js'
import { User } from '../src/users/entities/user.entity.js'
import { Vehicle } from '../src/vehicles/entities/vehicle.entity.js'

const HOUR_MS = 60 * 60 * 1000

export const hoursFromNow = (hours: number) =>
  new Date(Date.now() + hours * HOUR_MS)

export function createFixtures(dataSource: DataSource) {
  let sequence = 0

  const createVehicle = () => {
    sequence += 1
    return dataSource.getRepository(Vehicle).save({
      vin: `TESTVIN${String(sequence).padStart(10, '0')}`,
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      mileage: 30_000,
      batteryCapacityKwh: 60,
      batterySohPercent: 95,
      rangeKm: 400,
      registrationDate: '2022-01-15',
      condition: null,
      photos: [],
      city: 'Berlin',
      country: 'DE',
    })
  }

  return {
    createDealer() {
      sequence += 1
      return dataSource.getRepository(User).save({
        email: `dealer${sequence}@example.com`,
        role: 'DEALER',
        name: `Dealer ${sequence}`,
      })
    },

    async createAuction(
      status: AuctionStatus,
      startsAt: Date,
      endsAt: Date,
      reservePrice = 10_000,
    ) {
      const vehicle = await createVehicle()
      return dataSource.getRepository(Auction).save({
        vehicleId: vehicle.id,
        status,
        startsAt,
        endsAt,
        startingPrice: 5_000,
        reservePrice,
        minIncrement: 100,
      })
    },

    createBid(
      auctionId: string,
      dealerId: string,
      amount: number,
      createdAt = new Date(),
    ) {
      return dataSource
        .getRepository(Bid)
        .save({ auctionId, dealerId, amount, createdAt })
    },

    findAuction(id: string) {
      return dataSource.getRepository(Auction).findOneByOrFail({ id })
    },
  }
}
