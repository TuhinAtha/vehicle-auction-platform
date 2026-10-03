import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common'
import type { JwtPayload } from '@repo/shared'
import { CurrentUser } from '../auth/decorators.js'
import { AuctionsService } from './auctions.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { ListAuctionsQueryDto } from './dto/list-auctions-query.dto.js'
import { UpdateAuctionDto } from './dto/update-auction.dto.js'

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto)
  }

  @Get()
  findAll(
    @Query() { phase }: ListAuctionsQueryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.auctionsService.findAll(user.role, phase)
  }

  @Get('counts')
  countByPhase(@CurrentUser() user: JwtPayload) {
    return this.auctionsService.countByPhase(user.role)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.auctionsService.findOne(id, user.role)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionsService.update(id, updateAuctionDto)
  }
}
