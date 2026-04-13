import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import AddToCartButton from "@/components/product/AddToCartButton"
import ProductCardImage from "@/components/product/ProductCardImage"
import { getProductsAction } from "@/lib/actions/product.actions"

type ProductItem = {
  id: string
  slug: string
  name: string
  price: number
  compareAtPrice?: number
  unit?: string
  images?: string[]
}

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  )
}

export default async function FeaturedProducts() {
  let products: ProductItem[] = []
  let failedToLoad = false

  try {
    const getProducts = getProductsAction as unknown as (params?: {
      limit?: number
    }) => Promise<ProductItem[] | { products?: ProductItem[] }>
    const result = await getProducts({ limit: 4 })
    const fetchedProducts = Array.isArray(result) ? result : (result.products ?? [])
    products = fetchedProducts.slice(0, 4)
  } catch {
    failedToLoad = true
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">منتجات مميزة</h2>
        <Link href="/shop" className="text-sm text-[#00BFFF]">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {failedToLoad
          ? Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
          : products.map((product, index) => {
              const image = product.images?.[0]
              const hasDiscount =
                typeof product.compareAtPrice === "number" &&
                product.compareAtPrice > product.price
              const discountPercent = hasDiscount
                ? Math.round(
                    ((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100,
                  )
                : 0

              return (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-[#00BFFF]/50">
                  <Link href={`/shop/${product.slug}`} className="relative block">
                    <ProductCardImage
                      src={image}
                      alt={product.name}
                      colorClass={fallbackColors[index % fallbackColors.length]}
                    />

                    {hasDiscount && (
                      <span className="absolute top-2 left-2 rounded-md bg-[#FF2D9B] px-2 py-0.5 text-xs font-medium text-white">
                        -{discountPercent}%
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-col gap-1 p-3 text-right">
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {product.unit ? `لكل ${product.unit}` : "للوحدة"}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-[#00BFFF]">
                        {product.price.toLocaleString("ar-EG")} ج.م
                      </p>
                      {hasDiscount ? (
                        <p className="text-xs text-muted-foreground line-through">
                          {product.compareAtPrice?.toLocaleString("ar-EG")} ج.م
                        </p>
                      ) : (
                        <span />
                      )}
                    </div>

                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        images: product.images ?? [],
                      }}
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-[#00BFFF]/10 py-1.5 text-xs font-medium text-[#00BFFF] transition-colors hover:bg-[#00BFFF] hover:text-black">
                      <ShoppingCart className="h-3 w-3" />
                      أضف للسلة
                    </AddToCartButton>
                  </div>
                </div>
              )
            })}
      </div>
    </section>
  )
}
