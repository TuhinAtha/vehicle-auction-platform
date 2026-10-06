import type { VehicleDetail } from "@repo/shared"

import { Badge } from "@/components/ui/badge"
import { VEHICLE_AVAILABILITY_BADGE } from "@/constants/vehicle.constant"
import { AuctionDetailLayout } from "@/features/auctions/components/AuctionDetailLayout"
import { VehicleAuctionHistory } from "@/features/auctions/components/VehicleAuctionHistory"
import { VehicleSideCard } from "./VehicleSideCard"

export const VehicleDetailView = ({ vehicle }: { vehicle: VehicleDetail }) => {
  const { label, className } = VEHICLE_AVAILABILITY_BADGE[vehicle.availability]

  return (
    <AuctionDetailLayout
      vehicle={vehicle}
      badge={<Badge className={className}>{label}</Badge>}
      sideCard={<VehicleSideCard vehicle={vehicle} />}
    >
      <VehicleAuctionHistory auctions={vehicle.auctions} />
    </AuctionDetailLayout>
  )
}
