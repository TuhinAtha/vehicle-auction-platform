import { cookies } from "next/headers"
import type { LoginResponse } from "@repo/types"

import { tokenMaxAge } from "@/lib/auth"
import { AUTH_COOKIE } from "@/constants/auth.constant"
import { API_ORIGIN } from "@/constants/url.constant"

export async function POST(request: Request) {
  const body = await request.text()

  let res: Response
  try {
    res = await fetch(`${API_ORIGIN}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
    })
  } catch {
    return Response.json(
      { message: "Auth service unavailable" },
      { status: 502 }
    )
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    return Response.json(data ?? { message: "Login failed" }, {
      status: res.status,
    })
  }

  const { accessToken, user } = data as LoginResponse
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokenMaxAge(accessToken),
  })

  return Response.json({ user })
}
