import { Card, CardContent } from "@/components/ui/card"

export const StatCard = ({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: React.ReactNode
}) => (
  <Card size="sm">
    <CardContent className="flex flex-col gap-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <div className="text-xs text-muted-foreground">{children}</div>
    </CardContent>
  </Card>
)
