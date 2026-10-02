import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { LoginForm } from "./login-form"
import { REDIRECT_FROM } from "@/constants/auth.constant"
import { HOME_PATH } from "@/constants/path.constant"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [REDIRECT_FROM]?: string | string[] }>
}) {
  const loginRedirectedFrom = (await searchParams)[REDIRECT_FROM]
  // Only allow same-site paths, so ?from= can't send users to another site.
  // "/" isn't a real destination: the form sends users to their role's home.
  const redirectTo =
    typeof loginRedirectedFrom === "string" &&
    loginRedirectedFrom !== HOME_PATH &&
    /^\/(?![/\\])/.test(loginRedirectedFrom)
      ? loginRedirectedFrom
      : undefined

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to continue.
          </CardDescription>
        </CardHeader>
        <LoginForm redirectTo={redirectTo} />
      </Card>
    </div>
  )
}
