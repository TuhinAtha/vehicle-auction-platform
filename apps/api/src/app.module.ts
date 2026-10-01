import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller.js'
import { AppService } from './app.service.js'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VehiclesModule } from './vehicles/vehicles.module.js'
import { HealthModule } from './health/health.module.js'
import { AuctionsModule } from './auctions/auctions.module.js'
import { BidsModule } from './bids/bids.module.js'
import { UsersModule } from './users/users.module.js'

@Module({
  imports: [
    // Repo-root .env (shared with docker-compose); scripts run from apps/api.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        host: config.get('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get('POSTGRES_USER', 'user'),
        password: config.get('POSTGRES_PASSWORD', 'password'),
        database: config.get('POSTGRES_DB', 'db'),
        autoLoadEntities: true,
        synchronize: config.get('DB_SYNC') !== 'false', // dev only; use migrations in production
      }),
    }),
    VehiclesModule,
    HealthModule,
    AuctionsModule,
    BidsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
