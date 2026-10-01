import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 17, unique: true })
  vin: string

  @Column({ type: 'varchar' })
  make: string

  @Column({ type: 'varchar' })
  model: string

  @Column({ type: 'int' })
  year: number

  @Column({ type: 'int' })
  mileage: number

  @Column({ type: 'double precision' })
  batteryCapacityKwh: number

  @Column({ type: 'double precision' })
  batterySohPercent: number

  @Column({ type: 'double precision' })
  rangeKm: number

  /** YYYY-MM-DD */
  @Column({ type: 'date' })
  registrationDate: string

  @Column({ type: 'text', nullable: true })
  condition: string | null

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  photos: string[]

  @Column({ type: 'varchar' })
  city: string

  @Column({ type: 'varchar' })
  country: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
