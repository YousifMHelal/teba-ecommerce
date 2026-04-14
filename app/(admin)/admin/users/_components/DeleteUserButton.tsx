"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { deleteUser } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"

export default function DeleteUserButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      return
    }

    await deleteUser(id)
    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  )
}
