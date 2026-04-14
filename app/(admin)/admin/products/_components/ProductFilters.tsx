"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"

type CategoryOption = {
  id: string
  name: string
  slug: string
}

type ProductFiltersProps = {
  categories: CategoryOption[]
  initialSearch: string
  initialCategory: string
}

export default function ProductFilters({
  categories,
  initialSearch,
  initialCategory,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(initialSearch)
  const [category, setCategory] = useState(initialCategory)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    setCategory(initialCategory)
  }, [initialCategory])

  const updateQuery = (nextSearch: string, nextCategory: string) => {
    const params = new URLSearchParams()

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim())
    }

    if (nextCategory) {
      params.set("category", nextCategory)
    }

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
      <Input
        value={search}
        onChange={(event) => {
          const nextSearch = event.target.value
          setSearch(nextSearch)
          updateQuery(nextSearch, category)
        }}
        placeholder="ابحث باسم المنتج..."
        className="h-10 md:w-72"
      />
      <select
        value={category}
        onChange={(event) => {
          const nextCategory = event.target.value
          setCategory(nextCategory)
          updateQuery(search, nextCategory)
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-56">
        <option value="">كل الفئات</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}
