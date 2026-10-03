import type { UserRole } from '../types/user.type'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  createdAt: string
  updatedAt: string
}
