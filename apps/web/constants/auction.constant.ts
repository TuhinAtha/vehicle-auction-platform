import type { AuctionPhase, AuctionResult, AuctionStatus } from "@repo/shared"

/** Query param the auction lists are filtered by, e.g. `/admin?phase=LIVE`. */
export const PHASE_QUERY_PARAM = "phase"

export const AUCTION_PHASE_LABEL: Record<AuctionPhase, string> = {
  SCHEDULED: "Scheduled",
  LIVE: "Live",
  COMPLETED: "Completed",
  REVIEW: "Review",
}

type BadgeStyle = {
  label: string
  /** Background and text colour classes, merged over the Badge defaults. */
  className: string
}

export const AUCTION_STATUS_BADGE: Record<AuctionStatus, BadgeStyle> = {
  LIVE: {
    label: "Live",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  SCHEDULED: {
    label: "Scheduled",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  ENDED: {
    label: "Ended",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
}

export const AUCTION_RESULT_BADGE: Record<AuctionResult, BadgeStyle> = {
  SOLD: {
    label: "Sold",
    className:
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  },
  UNSOLD: {
    label: "Unsold",
    className: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
}

export const AUCTION_AWAITING_RESULT_BADGE: BadgeStyle = {
  label: "Awaiting response",
  className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
}
