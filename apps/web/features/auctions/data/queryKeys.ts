export const AUCTION_QUERY_KEYS = {
  all: ["auctions"] as const,
  list: (options?: unknown) => [...AUCTION_QUERY_KEYS.all, options] as const,
  counts: () => [...AUCTION_QUERY_KEYS.all, "counts"] as const,
  detail: (id: string) => [...AUCTION_QUERY_KEYS.all, "detail", id] as const,
  myBids: (options?: unknown) =>
    [...AUCTION_QUERY_KEYS.all, "my-bids", options] as const,
  myBidCounts: () => [...AUCTION_QUERY_KEYS.all, "my-bids", "counts"] as const,
  myBid: (id: string) =>
    [...AUCTION_QUERY_KEYS.all, "my-bids", "detail", id] as const,
}
