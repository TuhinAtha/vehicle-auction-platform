import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common'
import { AuctionsService } from './auctions.service.js'
import { CreateAuctionDto } from './dto/create-auction.dto.js'
import { UpdateAuctionDto } from './dto/update-auction.dto.js'

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto)
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.auctionsService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuctionDto: UpdateAuctionDto,
  ) {
    return this.auctionsService.update(id, updateAuctionDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.auctionsService.remove(id)
  }
}
