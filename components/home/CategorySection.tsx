import Image from "next/image"
import Link from "next/link"
import { FlaskConical } from "lucide-react"

import { getCategoriesAction as getCategories } from "@/lib/actions/category.actions"

type CategoryItem = {
  id?: string
  slug: string
  name: string
  image?: string | null
}

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const

function CategorySkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-4">
      <div className="mx-auto mb-3 h-14 w-14 rounded-xl bg-muted" />
      <div className="mx-auto h-3 w-16 rounded bg-muted" />
    </div>
  )
}

export default async function CategorySection() {
  // سيرفاكتانت | أحماض | عطور ومعطرات | مكثفات | مبيضات | عبوات وتغليف
  let categories: CategoryItem[] = []

  try {
    categories = (await getCategories()) as CategoryItem[]
  } catch {
    categories = []
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">تسوّق حسب الفئة</h2>
        <Link href="/categories" className="text-sm text-[#00BFFF]">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.length === 0
          ? Array.from({ length: 6 }).map((_, index) => <CategorySkeleton key={index} />)
          : categories.slice(0, 6).map((category, index) => (
              <Link
                key={category.id ?? category.slug}
                href={`/categories/${category.slug}`}
                className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:border-[#00BFFF]/50 hover:bg-[#00BFFF]/5">
                <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                  {category.image ? (
                    <Image src={category.image} alt={category.name} fill className="object-cover" />
                  ) : (
                    <div
                      className={`flex h-full w-full items-center justify-center ${fallbackColors[index % fallbackColors.length]}`}>
                      <FlaskConical className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <p className="line-clamp-2 text-center text-xs font-medium text-muted-foreground">
                  {category.name}
                </p>
              </Link>
            ))}
      </div>
    </section>
  )
}
