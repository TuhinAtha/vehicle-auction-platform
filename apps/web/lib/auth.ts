import "server-only"

import type { AuthUser } from "@repo/shared"
import { cache } from "react"

import { fetchApi } from "@/lib/fetch-api"
import { decodeJwtPayload } from "@/lib/jwt"

/** Seconds until the JWT's `exp`, or undefined if it can't be read. */
export function tokenMaxAge(token: string) {
  const exp = decodeJwtPayload(token)?.exp
  return exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : undefined
}

/**
 * The logged-in user's profile, or null if there's no valid session.
 * For server components; cached so repeated calls in one request hit the API once.
 */
export const getProfile = cache((): Promise<AuthUser | null> =>
  fetchApi<AuthUser>("/auth/profile").catch(() => null)
)
