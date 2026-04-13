import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ProductVariantSelectorProps = {
  label?: string
  options?: string[]
}

export function ProductVariantSelector({ label = "Size", options = ["S", "M", "L", "XL"] }: ProductVariantSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-zinc-950">{label}</p>
      <Select>
        <SelectTrigger className="h-11 rounded-xl">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
