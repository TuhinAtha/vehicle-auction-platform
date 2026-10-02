import type { UserRole } from "@repo/types"
import { HOME_PATH, LOGIN_PATH, ROLE_HOME } from "@/constants/path.constant"

export function shouldSendToRoleHome(pathname: string, role: UserRole) {
  const isLoginOrRoot = pathname === LOGIN_PATH || pathname === HOME_PATH
  return isLoginOrRoot || belongsToOtherRole(pathname, role)
}

/** True if the path is under another role's home, e.g. /admin/… for a dealer. */
function belongsToOtherRole(pathname: string, role: UserRole) {
  return Object.entries(ROLE_HOME).some(
    ([otherRole, basePath]) =>
      otherRole !== role && isSameOrSubpath(pathname, basePath)
  )
}

/** True for `/admin` and `/admin/...`, but not `/administrator`. */
function isSameOrSubpath(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}
