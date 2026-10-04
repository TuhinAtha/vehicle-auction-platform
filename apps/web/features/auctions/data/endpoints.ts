export const AUCTION_ENDPOINTS = {
  root: "/auctions",
  counts: "/auctions/counts",
  detail: (id: string) => `/auctions/${id}`,
  bids: (id: string) => `/auctions/${id}/bids`,
} as const
