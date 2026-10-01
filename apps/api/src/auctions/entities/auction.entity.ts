import {
  AUCTION_RESULTS,
  AUCTION_STATUSES,
  type AuctionResult,
  type AuctionStatus,
} from '@repo/types'
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm'
import { Bid } from '../../bids/entities/bid.entity.js'
import { Vehicle } from '../../vehicles/entities/vehicle.entity.js'

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Vehicle, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Relation<Vehicle>

  @Index()
  @Column({ type: 'uuid' })
  vehicleId: string

  @Column({ type: 'timestamptz' })
  startsAt: Date

  @Column({ type: 'timestamptz' })
  endsAt: Date

  /** Whole currency units */
  @Column({ type: 'int' })
  reservePrice: number

  /** Whole currency units */
  @Column({ type: 'int' })
  minIncrement: number

  @Column({
    type: 'enum',
    enum: AUCTION_STATUSES,
    enumName: 'auction_status',
    default: 'SCHEDULED',
  })
  status: AuctionStatus

  /** Set once the auction has ended */
  @Column({
    type: 'enum',
    enum: AUCTION_RESULTS,
    enumName: 'auction_result',
    nullable: true,
  })
  result: AuctionResult | null

  /** Set when the auction ends as SOLD */
  @ManyToOne(() => Bid, { nullable: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'winningBidId' })
  winningBid: Relation<Bid> | null

  @Column({ type: 'uuid', nullable: true })
  winningBidId: string | null

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
