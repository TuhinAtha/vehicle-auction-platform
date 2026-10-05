export const VEHICLE_QUERY_KEYS = {
  all: ["vehicles"] as const,
  list: (options?: unknown) => [...VEHICLE_QUERY_KEYS.all, options] as const,
  counts: () => [...VEHICLE_QUERY_KEYS.all, "counts"] as const,
}
