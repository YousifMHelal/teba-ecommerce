import { prisma } from "@/lib/prisma"
import { getHomepageFeaturedProductSlots } from "@/lib/actions/product.actions"

import HomepageFeaturedProductsForm from "./_components/HomepageFeaturedProductsForm"

export const metadata = { title: "منتجات الصفحة الرئيسية" }

export default async function AdminHomepagePage() {
  const [products, featuredSlots] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { name: "asc" },
    }),
    getHomepageFeaturedProductSlots(),
  ])

  const productById = new Map(products.map((product) => [product.id, product]))
  const selectedProducts = featuredSlots.map((slot) => ({
    position: slot.position,
    productId: slot.productId,
    product: productById.get(slot.productId) ?? null,
  }))

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl font-bold">منتجات الصفحة الرئيسية</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          اختر 4 منتجات ليتم عرضها في قسم المنتجات المميزة في الصفحة الرئيسية.
        </p>
      </div>

      <HomepageFeaturedProductsForm
        products={products}
        featuredProducts={selectedProducts}
      />
    </div>
  )
}
