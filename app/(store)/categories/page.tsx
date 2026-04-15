import Image from "next/image"
import Link from "next/link"
import { FlaskConical, SearchX } from "lucide-react"

import { getCategories } from "@/lib/actions/category.actions"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const

export const metadata = {
  title: "الأقسام",
  description: "تصفح جميع الأقسام والمنتجات المتاحة في طيبة",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 rounded-3xl border bg-linear-to-br from-card via-card to-muted/20 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
              الأقسام
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              كل الأقسام في مكان واحد
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              استعرض الفئات المتاحة، واعثر بسرعة على المنتجات المناسبة لكل استخدام.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <div className="rounded-2xl border bg-background/70 px-4 py-3 shadow-sm backdrop-blur">
              <div className="text-muted-foreground">إجمالي الأقسام</div>
              <div className="mt-1 text-2xl font-bold">{categories.length}</div>
            </div>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto rounded-2xl px-4 py-3",
              )}>
              تصفح المتجر
            </Link>
          </div>
        </div>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category, index) => {
            const fallbackColor =
              fallbackColors[index % fallbackColors.length]

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden bg-muted">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center",
                        fallbackColor,
                      )}>
                      <FlaskConical className="h-10 w-10" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/55 to-transparent p-4">
                    <span className="inline-flex rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
                      {category._count.products} منتج
                    </span>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  <h2 className="line-clamp-1 text-base font-semibold">
                    {category.name}
                  </h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    استكشف منتجات {category.name} وتصفحها بسهولة من خلال المجموعة المخصصة لها.
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold">لا توجد أقسام حالياً</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            لم يتم إضافة أي أقسام بعد. ستظهر هنا بمجرد إنشائها من لوحة التحكم.
          </p>
        </div>
      )}
    </div>
  )
}
