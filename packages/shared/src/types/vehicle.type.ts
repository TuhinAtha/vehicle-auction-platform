import type { Vehicle } from '../interfaces/vehicle.interface'

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
