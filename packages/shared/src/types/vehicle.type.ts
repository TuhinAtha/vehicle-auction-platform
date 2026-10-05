import type { VEHICLE_AVAILABILITIES } from '../constants/vehicle.constant'
import type { Vehicle } from '../interfaces/vehicle.interface'

export type VehicleAvailability = (typeof VEHICLE_AVAILABILITIES)[number]

/** GET /vehicles/counts */
export type VehicleAvailabilityCounts = Record<VehicleAvailability, number>

export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>
