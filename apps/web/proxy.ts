import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE } from "@/constants/auth.constant"
import { LOGIN_PATH, ROLE_HOME } from "@/constants/path.constant"
import { redirectTo, redirectToLogin } from "@/lib/proxy/responses"
import { shouldSendToRoleHome } from "@/lib/proxy/rules"
import { readSession } from "@/lib/proxy/session"

/**
 * Routing rules, checked on every page request:
 *
 * Logged out:
 *   - /login             → allowed
 *   - anything else      → /login?redirectFrom=<path>
 *
 * Logged in:
 *   - /login or /        → the user's role home (e.g. /dealer)
 *   - another role's area (a dealer opening /admin/…) → the user's role home
 *   - anything else      → allowed
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = readSession(request.cookies.get(AUTH_COOKIE)?.value)

  if (!session) {
    if (pathname === LOGIN_PATH) return NextResponse.next()
    return redirectToLogin(request)
  }

  if (shouldSendToRoleHome(pathname, session.role)) {
    return redirectTo(request, ROLE_HOME[session.role])
  }

  return NextResponse.next()
}

export const config = {
  // Skip API routes, Next internals and static files (anything with an extension).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
}
