import { cn } from "cn"

export const LabeledValue = ({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) => (
  <div className={cn("flex min-w-0 flex-col gap-0.5", className)}>
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="font-medium tabular-nums">{children}</dd>
  </div>
)
