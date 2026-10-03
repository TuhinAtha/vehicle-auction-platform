import "server-only"

import { cookies } from "next/headers"

import { AUTH_COOKIE } from "@/constants/auth.constant"
import { API_ORIGIN } from "@/constants/url.constant"
import { ApiError, type FetchOptions, request } from "@/lib/http"

/** fetchApi("/auctions") → API_ORIGIN/api/auctions as the logged-in user. */
export async function fetchApi<T = void>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) throw new ApiError(401, "Not logged in")

  const headers = new Headers(options.headers)
  headers.set("Authorization", `Bearer ${token}`)
  return request<T>(`${API_ORIGIN}/api${path}`, {
    cache: "no-store",
    ...options,
    headers,
  })
}
