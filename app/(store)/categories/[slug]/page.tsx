import { ProductGrid } from "@/components/product/ProductGrid"

type CategoryPageProps = {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Category</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{params.slug.replaceAll("-", " ")}</h1>
      </div>
      <ProductGrid />
    </main>
  )
}
