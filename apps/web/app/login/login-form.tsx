"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { AuthUser } from "@repo/shared"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ROLE_HOME } from "@/constants/path.constant"

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Enter your password."),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginValues) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).catch(() => null)

    if (!res?.ok) {
      const data = (await res?.json().catch(() => null)) as {
        message?: string
      } | null
      setError("root", {
        message:
          res?.status === 401
            ? "Invalid email or password."
            : (data?.message ?? "Something went wrong. Please try again."),
      })
      return
    }

    const { user } = (await res.json()) as { user: AuthUser }
    router.replace(redirectTo ?? ROLE_HOME[user.role])
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
        {errors.root && (
          <p role="alert" className="text-sm text-destructive">
            {errors.root.message}
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-6 flex flex-col gap-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </CardFooter>
    </form>
  )
}
