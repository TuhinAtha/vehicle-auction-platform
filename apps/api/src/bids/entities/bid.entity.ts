import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm'
import { Auction } from '../../auctions/entities/auction.entity.js'
import { User } from '../../users/entities/user.entity.js'

@Entity('bids')
@Index(['auctionId', 'amount'])
export class Bid {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Auction, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'auctionId' })
  auction: Relation<Auction>

  @Column({ type: 'uuid' })
  auctionId: string

  @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'dealerId' })
  dealer: Relation<User>

  @Index()
  @Column({ type: 'uuid' })
  dealerId: string

  /** Whole currency units */
  @Column({ type: 'int' })
  amount: number

  /** When the bid was placed */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date
}
