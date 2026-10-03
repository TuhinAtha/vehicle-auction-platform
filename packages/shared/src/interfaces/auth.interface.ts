import type { AuthUser } from '../types/auth.type'
import type { UserRole } from '../types/user.type'

export interface JwtPayload {
  sub: string
  email: string
  name: string
  role: UserRole
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}
