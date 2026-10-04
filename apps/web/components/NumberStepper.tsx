"use client"

import { MinusIcon, PlusIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { integer } from "@/lib/integer"

export const NumberStepper = ({
  value,
  onChange,
  min,
  step,
  prefix,
  suffix,
  ...props
}: {
  value: number | null
  onChange: (value: number | null) => void
  min: number
  step: number
  prefix?: string
  suffix?: string
} & Pick<
  React.ComponentProps<"input">,
  "id" | "aria-invalid" | "aria-describedby"
>) => (
  <InputGroup className="h-11">
    <InputGroupAddon align="inline-start">
      <InputGroupButton
        size="icon-sm"
        aria-label="Decrease"
        disabled={value === null}
        onClick={() => onChange(Math.max(min, (value ?? min) - step))}
      >
        <MinusIcon />
      </InputGroupButton>
      {prefix && <InputGroupText>{prefix}</InputGroupText>}
    </InputGroupAddon>
    <InputGroupInput
      inputMode="numeric"
      className="text-center text-lg font-semibold tabular-nums md:text-lg"
      value={value === null ? "" : integer.format(value)}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "")
        onChange(digits ? Number(digits) : null)
      }}
      {...props}
    />
    <InputGroupAddon align="inline-end">
      {suffix && <InputGroupText>{suffix}</InputGroupText>}
      <InputGroupButton
        size="icon-sm"
        aria-label="Increase"
        onClick={() => onChange(value === null ? min : value + step)}
      >
        <PlusIcon />
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
)
