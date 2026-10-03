import type { UserRole } from "@repo/shared"

export const LOGIN_PATH = "/login"
export const HOME_PATH = "/"

export const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  DEALER: "/dealer",
}
