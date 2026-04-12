import { sampleProducts } from "@/lib/constants"

export async function getProductsAction() {
  return sampleProducts
}

export async function getProductBySlugAction(slug: string) {
  return sampleProducts.find((product) => product.slug === slug) ?? null
}
