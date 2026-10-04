"use client"

import { parseAsString, useQueryState } from "nuqs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const PhaseFilter = ({
  text,
  phase = null,
  count,
}: {
  text: string
  phase?: string | null
  count: number
}) => {
  const [currentPhase, setPhase] = useQueryState(
    "phase",
    parseAsString.withOptions({ shallow: false, history: "push" })
  )
  const isActive = currentPhase === phase

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      aria-pressed={isActive}
      onClick={() => setPhase(phase)}
    >
      {text}
      <Badge
        variant={isActive ? "secondary" : "outline"}
        className="tabular-nums"
      >
        {count}
      </Badge>
    </Button>
  )
}
