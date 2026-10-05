export const BID_STATUSES = [
  'ACTIVE', // auction is live
  'PENDING', // ended, no result yet
  'WON', // sold to this dealer
  'NOT_WON', // sold to another dealer, or unsold; dealers can't tell which
] as const
