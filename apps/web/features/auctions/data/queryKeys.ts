export const AUCTION_QUERY_KEYS = {
  all: ["auctions"] as const,
  list: (options?: unknown) => [...AUCTION_QUERY_KEYS.all, options] as const,
  counts: () => [...AUCTION_QUERY_KEYS.all, "counts"] as const,
}
