import { PartialType } from '@nestjs/swagger'
import { CreateAuctionDto } from './create-auction.dto.js'

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {}
