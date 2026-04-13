import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ImageUploader() {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <Input type="file" accept="image/*" />
      <Button variant="outline">Upload image</Button>
    </div>
  )
}
