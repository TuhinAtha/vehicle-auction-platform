export const VEHICLE_QUERY_KEYS = {
  all: ["vehicles"] as const,
  list: () => [...VEHICLE_QUERY_KEYS.all, "list"] as const,
  available: (limit?: number) =>
    [...VEHICLE_QUERY_KEYS.all, "available", limit] as const,
}
