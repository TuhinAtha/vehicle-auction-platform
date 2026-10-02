import { cookies } from "next/headers"

import { AUTH_COOKIE } from "@/constants/auth.constant"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  return new Response(null, { status: 204 })
}
