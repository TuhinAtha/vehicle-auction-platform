import { jwtDecode } from "jwt-decode"

export type JwtPayload = {
  exp?: number
  role?: string
  email?: string
  name?: string
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch {
    return null
  }
}
