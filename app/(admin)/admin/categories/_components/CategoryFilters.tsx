"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"

type CategoryFiltersProps = {
  initialSearch: string
}

export default function CategoryFilters({
  initialSearch,
}: CategoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  const updateQuery = (value: string) => {
    const params = new URLSearchParams()

    if (value.trim()) {
      params.set("search", value.trim())
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <Input
      value={search}
      onChange={(event) => {
        const value = event.target.value
        setSearch(value)
        updateQuery(value)
      }}
      placeholder="ابحث باسم الفئة..."
      className="h-10 w-full md:w-80"
    />
  )
}
