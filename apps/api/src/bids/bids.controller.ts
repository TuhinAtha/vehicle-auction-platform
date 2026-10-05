import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import type { JwtPayload } from '@repo/shared'
import { CurrentUser, Role } from '../auth/decorators.js'
import { BidsService } from './bids.service.js'
import { CreateBidDto } from './dto/create-bid.dto.js'

@Controller('auctions/:auctionId/bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  @Role('DEALER')
  create(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Body() { amount }: CreateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.create(auctionId, user.sub, amount)
  }
}
