import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/types"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-black/5 bg-white/90">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{product.category ?? "Product"}</p>
          <h3 className="text-lg font-medium text-zinc-950">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-zinc-600">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-zinc-950">${product.price.toFixed(2)}</span>
          <Link href={`/shop/${product.slug}`} className={buttonVariants({ size: "sm" })}>
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
