import type { VehicleAvailability } from "@repo/shared"

import type { BadgeStyle } from "./auction.constant"

export const DEFAULT_VEHICLE_AVAILABILITY: VehicleAvailability = "UNLISTED"

export const VEHICLE_AVAILABILITY_BADGE: Record<
  VehicleAvailability,
  BadgeStyle
> = {
  UNLISTED: {
    label: "Unlisted",
    className:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
  SOLD: {
    label: "Sold",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  UNSOLD: {
    label: "Unsold",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
}
