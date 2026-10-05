export const AUCTION_ENDPOINTS = {
  root: "/auctions",
  counts: "/auctions/counts",
  myBids: "/auctions/my-bids",
  myBidCounts: "/auctions/my-bids/counts",
  myBid: (id: string) => `/auctions/my-bids/${id}`,
  detail: (id: string) => `/auctions/${id}`,
  bids: (id: string) => `/auctions/${id}/bids`,
  confirmSold: (id: string) => `/auctions/${id}/confirm-sold`,
  markUnsold: (id: string) => `/auctions/${id}/mark-unsold`,
} as const
