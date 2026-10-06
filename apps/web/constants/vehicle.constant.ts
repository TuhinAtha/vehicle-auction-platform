import type { VehicleAvailability } from "@repo/shared"

import type { BadgeStyle } from "./auction.constant"

export const DEFAULT_VEHICLE_AVAILABILITY: VehicleAvailability = "AVAILABLE"

export const VEHICLE_AVAILABILITY_BADGE: Record<
  VehicleAvailability,
  BadgeStyle
> = {
  AVAILABLE: {
    label: "Available",
    className:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
  IN_AUCTION: {
    label: "In auction",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  SOLD: {
    label: "Sold",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
}
