import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common'
import type { JwtPayload } from '@repo/shared'
import { CurrentUser, Role } from '../auth/decorators.js'
import { BidsService } from './bids.service.js'
import { CreateBidDto } from './dto/create-bid.dto.js'

@Controller('auctions/:auctionId')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post('place-bid')
  @Role('DEALER')
  place(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Body() { amount }: CreateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.place(auctionId, user.sub, amount)
  }

  @Post('raise-bid')
  @Role('DEALER')
  raise(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Body() { amount }: CreateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.raise(auctionId, user.sub, amount)
  }
}
