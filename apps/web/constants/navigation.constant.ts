export const NAVIGATION_PATHS = {
  AUCTIONS: { path: "/", text: "Auctions" },
  VEHICLES: { path: "/vehicles", text: "Vehicles" },
  MY_BIDS: { path: "/mybids", text: "My bids" },
  SETTINGS: { path: "/settings", text: "Settings" },
} as const

export type NavigationPath =
  (typeof NAVIGATION_PATHS)[keyof typeof NAVIGATION_PATHS]
