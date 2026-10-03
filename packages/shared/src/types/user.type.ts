import type { USER_ROLES } from '../constants/user.constant'
import type { User } from '../interfaces/user.interface'

export type UserRole = (typeof USER_ROLES)[number]

export type CreateUserInput = Pick<User, 'email' | 'role' | 'name'>
