import "server-only"

import type { AuthUser } from "@repo/shared"
import { cookies } from "next/headers"
import { cache } from "react"

import { AUTH_COOKIE } from "@/constants/auth.constant"

import { fetchApi } from "@/lib/fetch-api"
import { decodeJwtPayload } from "@/lib/jwt"
import { readSession } from "@/lib/proxy/session"

/** Seconds until the JWT's `exp`, or undefined if it can't be read. */
export function tokenMaxAge(token: string) {
  const exp = decodeJwtPayload(token)?.exp
  return exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : undefined
}

/**
 * The logged-in user's profile, or null if there's no valid session.
 * Cached so repeated calls in one request hit the API once.
 */
export const getProfile = cache((): Promise<AuthUser | null> =>
  fetchApi<AuthUser>("/auth/profile").catch(() => null)
)

/**
 * The logged-in user as stated in the session cookie, or null without a session.
 *
 * Like the proxy, this reads the token without verifying it and makes no API
 * call, so it agrees with the proxy on who is logged in.
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  const session = readSession(token)
  if (!token || !session) return null

  const payload = decodeJwtPayload(token)
  return {
    email: payload?.email ?? "",
    name: payload?.name ?? "",
    role: session.role,
  }
}
