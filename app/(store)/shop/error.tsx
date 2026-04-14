"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ShopError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="mb-2 text-lg font-bold">تعذّر تحميل المنتجات</h2>
      <p className="mb-6 text-sm text-muted-foreground">حدث خطأ أثناء جلب البيانات</p>
      <Button onClick={reset}>حاول مجدداً</Button>
    </div>
  )
}
