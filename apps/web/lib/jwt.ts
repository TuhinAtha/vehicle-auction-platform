export type JwtPayload = {
  exp?: number
  role?: string
  email?: string
  name?: string
}

/**
 * Decodes a JWT's payload without verifying its signature, or null if malformed.
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
