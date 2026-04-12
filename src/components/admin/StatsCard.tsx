import { Card, CardContent } from "@/components/ui/card"

type StatsCardProps = {
  label: string
  value: string
  delta?: string
}

export function StatsCard({ label, value, delta }: StatsCardProps) {
  return (
    <Card className="border-black/5 bg-white/90">
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="text-3xl font-semibold text-zinc-950">{value}</p>
        {delta ? <p className="text-xs text-zinc-500">{delta}</p> : null}
      </CardContent>
    </Card>
  )
}
