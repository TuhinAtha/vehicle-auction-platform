"use client"
import { useMemo } from "react"
import { cn } from "cn"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { PHASE_QUERY_PARAM } from "@/constants/auction.constant"

/** Links to the current page with `?phase=<phase>`, keeping the other query params. */
export const PhaseFilter = ({
  text,
  phase,
  count,
}: {
  text: string
  phase?: string
  count: number
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isActive = useMemo(
    () =>
      searchParams.get(PHASE_QUERY_PARAM) === phase ||
      (!phase && searchParams.get(PHASE_QUERY_PARAM) === null),
    [searchParams, phase]
  )

  const params = new URLSearchParams(searchParams)
  if (phase) {
    params.set(PHASE_QUERY_PARAM, phase)
  } else {
    params.delete(PHASE_QUERY_PARAM)
  }

  return (
    <Link
      href={`${pathname}?${params.toString()}`}
      scroll={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "outline" })
      )}
    >
      {text}
      <Badge
        variant={isActive ? "secondary" : "outline"}
        className="tabular-nums"
      >
        {count}
      </Badge>
    </Link>
  )
}
