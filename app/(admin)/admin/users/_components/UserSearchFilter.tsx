"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UserSearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get("search") ?? ""
  const role = (searchParams.get("role") ?? "ALL") as "ALL" | "USER" | "ADMIN"

  const updateParams = useCallback((newSearch: string, newRole: string) => {
    const params = new URLSearchParams()
    if (newSearch) params.set("search", newSearch)
    if (newRole !== "ALL") params.set("role", newRole)

    router.push(`/admin/users${params.toString() ? `?${params.toString()}` : ""}`)
  }, [router])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Input
          placeholder="ابحث باسم أو بريد إلكتروني..."
          value={search}
          onChange={(e) => updateParams(e.target.value, role)}
          className="pe-10"
        />
        {search && (
          <button
            onClick={() => updateParams("", role)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <select
        value={role}
        onChange={(e) => updateParams(search, e.target.value)}
        className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option value="ALL">جميع الصلاحيات</option>
        <option value="USER">عملاء</option>
        <option value="ADMIN">أدمن</option>
      </select>
    </div>
  )
}
