import { sampleProducts } from "@/lib/constants"
import {
  deleteProductFromAlgolia,
  syncProductToAlgolia,
  type AlgoliaProductInput,
} from "@/lib/algolia"

export async function getProductsAction() {
  return sampleProducts
}

export async function getProductBySlugAction(slug: string) {
  return sampleProducts.find((product) => product.slug === slug) ?? null
}

export async function syncProductToAlgoliaAction(product: AlgoliaProductInput) {
  await syncProductToAlgolia(product)
}

export async function deleteProductFromAlgoliaAction(productId: string) {
  await deleteProductFromAlgolia(productId)
}
