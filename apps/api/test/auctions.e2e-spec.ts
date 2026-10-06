import { ConflictException } from '@nestjs/common'
import { hoursFromNow } from './fixtures.js'
import { createTestApp } from './test-app.js'

describe('Auctions', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
  })

  beforeEach(async () => {
    await app.reset()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Status sync (open and close by time)', () => {
    it('should set a SCHEDULED auction to LIVE when its start time has passed', async () => {
      const auction = await app.createAuction(
        'SCHEDULED',
        hoursFromNow(-1),
        hoursFromNow(1),
      )

      await app.auctions.syncStatuses()

      expect((await app.findAuction(auction.id)).status).toBe('LIVE')
    })

    it('should set a LIVE auction to ENDED with no result when its end time has passed', async () => {
      const auction = await app.createAuction(
        'LIVE',
        hoursFromNow(-2),
        hoursFromNow(-1),
      )

      await app.auctions.syncStatuses()

      const ended = await app.findAuction(auction.id)
      expect(ended.status).toBe('ENDED')
      expect(ended.result).toBeNull()
    })

    it('should set a SCHEDULED auction straight to ENDED when both its start and end time have passed', async () => {
      const auction = await app.createAuction(
        'SCHEDULED',
        hoursFromNow(-2),
        hoursFromNow(-1),
      )

      await app.auctions.syncStatuses()

      expect((await app.findAuction(auction.id)).status).toBe('ENDED')
    })

    it('should keep an auction SCHEDULED when its start time is in the future', async () => {
      const auction = await app.createAuction(
        'SCHEDULED',
        hoursFromNow(1),
        hoursFromNow(2),
      )

      await app.auctions.syncStatuses()

      expect((await app.findAuction(auction.id)).status).toBe('SCHEDULED')
    })

    it('should reject a new bid when the auction is ENDED', async () => {
      const dealer = await app.createDealer()
      const auction = await app.createAuction(
        'LIVE',
        hoursFromNow(-2),
        hoursFromNow(-1),
      )
      await app.auctions.syncStatuses()

      await expect(
        app.bids.create(auction.id, dealer.id, 20_000),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('Result (confirm sold / mark unsold)', () => {
    const createEndedAuction = () =>
      app.createAuction('ENDED', hoursFromNow(-2), hoursFromNow(-1))

    it('should mark the auction SOLD to the highest bid when it meets the reserve price', async () => {
      const [first, second] = await Promise.all([
        app.createDealer(),
        app.createDealer(),
      ])
      const auction = await createEndedAuction()
      await app.createBid(auction.id, first.id, 11_000)
      const highest = await app.createBid(auction.id, second.id, 12_000)

      await app.auctions.confirmSold(auction.id)

      const sold = await app.findAuction(auction.id)
      expect(sold.result).toBe('SOLD')
      expect(sold.winningBidId).toBe(highest.id)
    })

    it('should pick the earlier bid as winner when two bids have the same amount', async () => {
      const [first, second] = await Promise.all([
        app.createDealer(),
        app.createDealer(),
      ])
      const auction = await createEndedAuction()
      await app.createBid(auction.id, second.id, 12_000, hoursFromNow(-3))
      const earlier = await app.createBid(
        auction.id,
        first.id,
        12_000,
        hoursFromNow(-4),
      )

      await app.auctions.confirmSold(auction.id)

      expect((await app.findAuction(auction.id)).winningBidId).toBe(earlier.id)
    })

    it('should refuse to confirm sold when the highest bid is below the reserve price', async () => {
      const dealer = await app.createDealer()
      const auction = await createEndedAuction()
      await app.createBid(auction.id, dealer.id, 9_999)

      await expect(app.auctions.confirmSold(auction.id)).rejects.toThrow(
        ConflictException,
      )

      const pending = await app.findAuction(auction.id)
      expect(pending.result).toBeNull()
      expect(pending.winningBidId).toBeNull()
    })

    it('should refuse to confirm sold when the auction has no bids', async () => {
      const auction = await createEndedAuction()

      await expect(app.auctions.confirmSold(auction.id)).rejects.toThrow(
        ConflictException,
      )
    })

    it('should refuse any result when the auction is still LIVE', async () => {
      const dealer = await app.createDealer()
      const auction = await app.createAuction(
        'LIVE',
        hoursFromNow(-1),
        hoursFromNow(1),
      )
      await app.createBid(auction.id, dealer.id, 12_000)

      await expect(app.auctions.confirmSold(auction.id)).rejects.toThrow(
        ConflictException,
      )
      await expect(app.auctions.markUnsold(auction.id)).rejects.toThrow(
        ConflictException,
      )
    })

    it('should mark the auction UNSOLD with no winning bid when marked unsold', async () => {
      const dealer = await app.createDealer()
      const auction = await createEndedAuction()
      await app.createBid(auction.id, dealer.id, 12_000)

      await app.auctions.markUnsold(auction.id)

      const unsold = await app.findAuction(auction.id)
      expect(unsold.result).toBe('UNSOLD')
      expect(unsold.winningBidId).toBeNull()
    })

    it('should refuse to change the result when the auction is already SOLD or UNSOLD', async () => {
      const dealer = await app.createDealer()
      const sold = await createEndedAuction()
      await app.createBid(sold.id, dealer.id, 12_000)
      await app.auctions.confirmSold(sold.id)
      const unsold = await createEndedAuction()
      await app.createBid(unsold.id, dealer.id, 12_000)
      await app.auctions.markUnsold(unsold.id)

      await expect(app.auctions.markUnsold(sold.id)).rejects.toThrow(
        ConflictException,
      )
      await expect(app.auctions.confirmSold(unsold.id)).rejects.toThrow(
        ConflictException,
      )
      expect((await app.findAuction(sold.id)).result).toBe('SOLD')
      expect((await app.findAuction(unsold.id)).result).toBe('UNSOLD')
    })
  })
})
