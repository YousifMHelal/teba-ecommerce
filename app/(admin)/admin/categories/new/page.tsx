import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function NewCategoryPage() {
  return (
    <form className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <div className="space-y-2">
        <Label htmlFor="category-name">Name</Label>
        <Input id="category-name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category-description">Description</Label>
        <Textarea id="category-description" rows={4} />
      </div>
      <Button type="submit">Create category</Button>
    </form>
  )
}
