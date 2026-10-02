import "server-only"

import type { AuthUser } from "@repo/types"
import { cookies } from "next/headers"
import { cache } from "react"

import { AUTH_COOKIE } from "@/constants/auth.constant"
import { API_ORIGIN } from "@/constants/url.constant"
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
export const getProfile = cache(async (): Promise<AuthUser | null> => {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) return null

  try {
    const res = await fetch(`${API_ORIGIN}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    return res.ok ? ((await res.json()) as AuthUser) : null
  } catch {
    return null
  }
})
