"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-sm space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-xl font-bold">حدث خطأ ما</h1>
        <p className="text-sm text-muted-foreground">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
        </p>
        <Button onClick={reset}>حاول مجدداً</Button>
      </div>
    </div>
  )
}
