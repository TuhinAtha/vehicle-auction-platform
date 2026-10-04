"use client"

import prettyMilliseconds from "pretty-ms"
import { useEffect, useState } from "react"

export const Countdown = ({ to, title }: { to: string; title?: string }) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const remaining = new Date(to).getTime() - now

  // The server and the browser render this a moment apart, so the text can differ.
  return (
    <time dateTime={to} title={title} suppressHydrationWarning>
      {remaining < 1000
        ? "0s"
        : prettyMilliseconds(remaining, {
            unitCount: 2,
            secondsDecimalDigits: 0,
          })}
    </time>
  )
}
