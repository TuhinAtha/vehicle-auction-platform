import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VehiclesModule } from './vehicles/vehicles.module.js'
import { HealthModule } from './health/health.module.js'
import { AuctionsModule } from './auctions/auctions.module.js'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL ?? 'postgres://app:app@localhost:5432/app',
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNC !== 'false', // dev only; use migrations in production
    }),
    VehiclesModule,
    HealthModule,
    AuctionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
