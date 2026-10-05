import type {
  AuctionPhase,
  AuctionResult,
  AuctionStatus,
  BidStatus,
} from "@repo/shared"

export const DEFAULT_AUCTION_PHASE: AuctionPhase = "LIVE"
export const DEFAULT_BID_STATUS: BidStatus = "ACTIVE"

export const AUCTION_PHASE_LABEL: Record<AuctionPhase, string> = {
  SCHEDULED: "Scheduled",
  LIVE: "Live",
  SOLD: "Sold",
  UNSOLD: "Unsold",
  PENDING: "Pending",
}

type BadgeStyle = {
  label: string
  /** Background and text colour classes, merged over the Badge defaults. */
  className: string
}

export const AUCTION_STATUS_BADGE: Record<AuctionStatus, BadgeStyle> = {
  LIVE: {
    label: "Live",
    className: "bg-blue-600 text-white dark:bg-blue-400 dark:text-blue-950",
  },
  SCHEDULED: {
    label: "Scheduled",
    className:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
  ENDED: {
    label: "Ended",
    className:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
}

export const AUCTION_RESULT_BADGE: Record<AuctionResult, BadgeStyle> = {
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

export const AUCTION_PENDING_BADGE: BadgeStyle = {
  label: "Pending",
  className: "bg-amber-500 text-amber-950 dark:bg-amber-400",
}

export const AUCTION_PHASE_BADGE_CLASS: Record<AuctionPhase, string> = {
  PENDING: AUCTION_PENDING_BADGE.className,
  LIVE: AUCTION_STATUS_BADGE.LIVE.className,
  SCHEDULED: AUCTION_STATUS_BADGE.SCHEDULED.className,
  SOLD: AUCTION_RESULT_BADGE.SOLD.className,
  UNSOLD: AUCTION_RESULT_BADGE.UNSOLD.className,
}

export const BID_STATUS_BADGE: Record<BidStatus, BadgeStyle> = {
  ACTIVE: {
    label: "Active",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  WON: {
    label: "Won",
    className: "bg-green-700 text-white dark:bg-green-400 dark:text-green-950",
  },
  NOT_WON: {
    label: "Not won",
    className:
      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
  },
}

export const AUCTION_REFRESH_INTERVAL_MS = 5000
