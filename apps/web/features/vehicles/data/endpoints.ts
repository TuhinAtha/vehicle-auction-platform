export const VEHICLE_ENDPOINTS = {
  root: "/vehicles",
  counts: "/vehicles/counts",
  photos: "/vehicles/photos",
  detail: (id: string) => `/vehicles/${id}`,
} as const
