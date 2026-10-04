"use client"

import { useEffect, useState } from "react"

import { formatCountdown } from "@/lib/countdown"

export const Countdown = ({ to, title }: { to: string; title?: string }) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // The server and the browser render this a moment apart, so the text can differ.
  return (
    <time dateTime={to} title={title} suppressHydrationWarning>
      {formatCountdown(to, now)}
    </time>
  )
}
