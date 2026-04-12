import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ProductFilters() {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-4 md:grid-cols-[1fr_auto] md:items-center">
      <Input placeholder="Filter products" className="h-11 rounded-full bg-white" />
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">New</Badge>
        <Badge variant="secondary">Best sellers</Badge>
        <Button variant="outline" className="rounded-full">
          Clear filters
        </Button>
      </div>
    </div>
  )
}
