import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ProductForm() {
  return (
    <form className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} />
      </div>
      <Button type="submit">Save product</Button>
    </form>
  )
}
