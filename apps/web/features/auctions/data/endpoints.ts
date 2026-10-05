export const AUCTION_ENDPOINTS = {
  root: "/auctions",
  counts: "/auctions/counts",
  myBids: "/auctions/my-bids",
  myBidCounts: "/auctions/my-bids/counts",
  detail: (id: string) => `/auctions/${id}`,
  placeBid: (id: string) => `/auctions/${id}/place-bid`,
  raiseBid: (id: string) => `/auctions/${id}/raise-bid`,
} as const
