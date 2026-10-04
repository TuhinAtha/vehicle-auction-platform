export const AUCTION_ENDPOINTS = {
  root: "/auctions",
  counts: "/auctions/counts",
  detail: (id: string) => `/auctions/${id}`,
} as const
