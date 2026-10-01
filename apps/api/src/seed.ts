import { NestFactory } from '@nestjs/core'
import type { CreateVehicleInput } from '@repo/types'
import { DataSource } from 'typeorm'
import { AppModule } from './app.module.js'
import { Vehicle } from './vehicles/entities/vehicle.entity.js'

const vehicles: CreateVehicleInput[] = [
  {
    vin: '5YJ3E1EA7MF000001',
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2021,
    mileage: 42000,
    batteryCapacityKwh: 75,
    batterySohPercent: 91.5,
    rangeKm: 450,
    registrationDate: '2021-05-14',
    condition: 'Minor scratches on rear bumper',
    photos: [
      'https://example.com/photos/model3-front.jpg',
      'https://example.com/photos/model3-interior.jpg',
    ],
    city: 'Berlin',
    country: 'DE',
  },
]

const app = await NestFactory.createApplicationContext(AppModule, {
  logger: ['error', 'warn'],
})

try {
  const repo = app.get(DataSource).getRepository(Vehicle)
  await repo.upsert(vehicles, ['vin'])
  console.log(`Seeded ${vehicles.length} vehicle(s):`)
  console.table(await repo.find({ order: { createdAt: 'ASC' } }), [
    'id',
    'vin',
    'make',
    'model',
    'year',
    'city',
  ])
} finally {
  await app.close()
}
