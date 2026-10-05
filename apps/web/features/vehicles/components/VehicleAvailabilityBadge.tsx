import type { VehicleAvailability } from "@repo/shared"

import { Badge } from "@/components/ui/badge"
import { VEHICLE_AVAILABILITY_BADGE } from "@/constants/vehicle.constant"

export const VehicleAvailabilityBadge = ({
  availability,
}: {
  availability: VehicleAvailability
}) => {
  const { label, className } = VEHICLE_AVAILABILITY_BADGE[availability]

  return <Badge className={className}>{label}</Badge>
}
