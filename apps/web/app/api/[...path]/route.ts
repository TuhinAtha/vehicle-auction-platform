import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE } from "@/constants/auth.constant"
import { API_ORIGIN } from "@/constants/url.constant"

/**
 * BFF proxy for browser requests: /api/<path> → Nest's /api/<path>, with the
 * httpOnly auth cookie turned into a bearer token. The more specific
 * /api/auth/login and /api/auth/logout routes take precedence over this one.
 */
async function forward(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value
  if (!token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { pathname, search } = request.nextUrl
  const headers = new Headers({ Authorization: `Bearer ${token}` })
  for (const name of ["content-type", "accept"]) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD"

  let res: Response
  try {
    res = await fetch(`${API_ORIGIN}${pathname}${search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    })
  } catch {
    return Response.json({ message: "API unavailable" }, { status: 502 })
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  })
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
}
