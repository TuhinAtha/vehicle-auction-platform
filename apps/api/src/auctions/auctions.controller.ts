import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import type { JwtPayload } from '@repo/shared'
import { CurrentUser, Role } from '../auth/decorators.js'
import { AuctionsService } from './auctions.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { ListAuctionsQueryDto } from './dto/list-auctions-query.dto.js'
import { ListMyBidsQueryDto } from './dto/list-my-bids-query.dto.js'

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  @Role('ADMIN')
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto)
  }

  @Get()
  findAll(
    @Query() { phase }: ListAuctionsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.auctionsService.findAll(user, phase)
  }

  @Get('counts')
  countByPhase(@CurrentUser() user: JwtPayload) {
    return this.auctionsService.countByPhase(user)
  }

  @Get('my-bids')
  @Role('DEALER')
  findMyBids(
    @Query() { phase }: ListMyBidsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.auctionsService.findMyBids(user.sub, phase)
  }

  @Get('my-bids/counts')
  @Role('DEALER')
  countMyBids(@CurrentUser() user: JwtPayload) {
    return this.auctionsService.countMyBids(user.sub)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.auctionsService.findOneFor(id, user)
  }
}
