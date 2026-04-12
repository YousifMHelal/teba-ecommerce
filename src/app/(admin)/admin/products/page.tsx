import { ProductGrid } from "@/components/product/ProductGrid"

export default function AdminProductsPage() {
  return (
    <main className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Products</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">Catalog management</h1>
      </div>
      <ProductGrid />
    </main>
  )
}
