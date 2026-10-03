export const AUCTION_QUERY_KEYS = {
  all: ["auctions"] as const,
  list: (searchParams?: { phase?: string }) =>
    [...AUCTION_QUERY_KEYS.all, { phase: searchParams?.phase }] as const,
  counts: () => [...AUCTION_QUERY_KEYS.all, "counts"] as const,
}
