import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE, REDIRECT_FROM } from "@/constants/auth.constant"
import { LOGIN_PATH } from "@/constants/path.constant"

export function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url))
}

export function redirectToLogin(request: NextRequest) {
  const url = new URL(LOGIN_PATH, request.url)
  url.searchParams.set(REDIRECT_FROM, request.nextUrl.pathname)

  const response = NextResponse.redirect(url)
  // Clear an expired or malformed token so it isn't sent again.
  response.cookies.delete(AUTH_COOKIE)
  return response
}
