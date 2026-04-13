import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { sampleProducts } from "@/lib/constants"

type ProductPageProps = {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = sampleProducts.find((item) => item.slug === params.slug)

  if (!product) {
    notFound()
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div className="aspect-square rounded-[1.75rem] bg-gradient-to-br from-zinc-200 to-zinc-100" />
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">{product.category}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">{product.name}</h1>
          <p className="mt-4 text-lg text-zinc-600">{product.description}</p>
        </div>
        <p className="text-3xl font-semibold text-zinc-950">${product.price.toFixed(2)}</p>
        <Button size="lg">Add to cart</Button>
      </div>
    </main>
  )
}
