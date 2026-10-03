import type { UserRole } from "@repo/shared"

import { ROLE_HOME } from "@/constants/path.constant"
import { decodeJwtPayload } from "@/lib/jwt"

export type Session = { role: UserRole }

/**
 * Reads the session from the JWT cookie, or null if missing, expired or malformed.
 *
 * The signature is NOT verified here (the secret lives in the API), so this is
 * only used to pick which page to show. The API verifies every data request.
 */
export function readSession(token: string | undefined): Session | null {
  if (!token) return null

  const payload = decodeJwtPayload(token)
  if (!payload) return null

  const isExpired = !!payload.exp && payload.exp * 1000 <= Date.now()
  const hasKnownRole = !!payload.role && payload.role in ROLE_HOME
  if (isExpired || !hasKnownRole) return null

  return { role: payload.role as UserRole }
}
