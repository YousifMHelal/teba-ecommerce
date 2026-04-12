import { sampleProducts } from "@/lib/constants"
import type { Product } from "@/types"

import { ProductCard } from "./ProductCard"

type ProductGridProps = {
  products?: Product[]
}

export function ProductGrid({ products = sampleProducts as unknown as Product[] }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
