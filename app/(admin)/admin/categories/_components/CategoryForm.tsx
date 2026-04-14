"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { createCategory, updateCategory } from "@/lib/actions/category.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/admin/ImageUploader"

type Props = {
  category?: {
    id: string
    name: string
    image: string | null
  }
}

export function CategoryForm({ category }: Props) {
  const router = useRouter()
  const [name, setName] = useState(category?.name ?? "")
  const [images, setImages] = useState<string[]>(category?.image ? [category.image] : [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = Boolean(category)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      setError("اسم الفئة مطلوب")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (isEditing && category) {
        await updateCategory(category.id, { name: name.trim(), image: images[0] })
      } else {
        await createCategory({ name: name.trim(), image: images[0] })
      }

      router.push("/admin/categories")
      router.refresh()
    } catch {
      setError("حدث خطأ أثناء حفظ الفئة")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
      <div className="space-y-1.5">
        <Label htmlFor="name">اسم الفئة</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="مثال: الإلكترونيات"
        />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>

      <div className="space-y-1.5">
        <Label>
          صورة الفئة <span className="text-xs text-muted-foreground">(اختياري)</span>
        </Label>
        <ImageUploader images={images} onChange={setImages} max={1} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : isEditing ? "تحديث الفئة" : "إضافة الفئة"}
        </Button>
      </div>
    </form>
  )
}
