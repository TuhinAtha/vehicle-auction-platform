import { cn } from "cn"

export const LabeledValue = ({
  label,
  dir = "vertical",
  className,
  children,
}: {
  label: string
  dir?: "vertical" | "horizontal"
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={cn(
      "flex min-w-0",
      dir === "horizontal"
        ? "items-center justify-between gap-4"
        : "flex-col gap-0.5",
      className
    )}
  >
    <dt
      className={cn("text-muted-foreground", dir === "vertical" && "text-xs")}
    >
      {label}
    </dt>
    <dd
      className={cn(
        "font-medium tabular-nums",
        dir === "horizontal" && "text-right"
      )}
    >
      {children}
    </dd>
  </div>
)
