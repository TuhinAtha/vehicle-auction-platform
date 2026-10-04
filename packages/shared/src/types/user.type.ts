import type { USER_ROLES } from '../constants/user.constant'

export type UserRole = (typeof USER_ROLES)[number]
