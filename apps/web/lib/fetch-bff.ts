import { type FetchOptions, request } from "@/lib/http"

/** fetchBff("/auctions") → /api/auctions; the BFF adds the auth token. */
export const fetchBff = <T = void>(path: string, options?: FetchOptions) =>
  request<T>(`/api${path}`, options)
