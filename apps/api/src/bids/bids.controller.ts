import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { BidsService } from './bids.service.js'
import { CreateBidDto } from './dto/create-bid.dto.js'

@Controller('auctions/:auctionId/bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  create(
    @Param('auctionId', ParseUUIDPipe) auctionId: string,
    @Body() createBidDto: CreateBidDto,
  ) {
    return this.bidsService.create(auctionId, createBidDto)
  }

  @Get()
  findAll(@Param('auctionId', ParseUUIDPipe) auctionId: string) {
    return this.bidsService.findAllForAuction(auctionId)
  }
}
