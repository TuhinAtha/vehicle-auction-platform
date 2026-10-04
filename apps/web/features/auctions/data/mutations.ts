import type {
  Auction,
  CreateAuctionInput,
  CreateVehicleInput,
  Vehicle,
} from "@repo/shared"

import { fetchBff } from "@/lib/fetch-bff"
import {
  type AuctionFormValues,
  auctionFormSchema,
  type VehicleFormValues,
  vehicleFormSchema,
} from "../lib/createAuctionFormSchema"
import { AUCTION_ENDPOINTS } from "./endpoints"

// Parsing with the vehicle or auction schema keeps only that half of the form values.

export function createVehicle(values: VehicleFormValues) {
  const vehicle = vehicleFormSchema.parse(values)

  return fetchBff<Vehicle>("/vehicles", {
    method: "POST",
    body: {
      ...vehicle,
      condition: vehicle.condition || null,
      photos: [],
    } satisfies CreateVehicleInput,
  })
}

export function createAuction(vehicleId: string, values: AuctionFormValues) {
  const auction = auctionFormSchema.parse(values)

  return fetchBff<Auction>(AUCTION_ENDPOINTS.root, {
    method: "POST",
    body: {
      ...auction,
      vehicleId,
      startsAt: new Date(auction.startsAt).toISOString(),
      endsAt: new Date(auction.endsAt).toISOString(),
    } satisfies CreateAuctionInput,
  })
}
