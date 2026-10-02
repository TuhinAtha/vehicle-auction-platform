export type JwtPayload = { exp?: number; role?: string }

/**
 * Decodes a JWT's payload without verifying its signature, or null if malformed.
 * Only use the result for UI/routing decisions — the API does the real check.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const base64url = token.split(".")[1]
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(atob(base64)) as JwtPayload
  } catch {
    return null
  }
}
