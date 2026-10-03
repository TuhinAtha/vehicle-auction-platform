import type { JwtPayload } from '../interfaces/auth.interface'

export type AuthUser = Pick<JwtPayload, 'email' | 'name' | 'role'>
