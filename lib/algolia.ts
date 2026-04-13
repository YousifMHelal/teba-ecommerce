import { algoliasearch } from "algoliasearch"

export type AlgoliaProductInput = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  images: string[]
  stock: number
  isActive: boolean
  category: { name: string; slug: string }
}

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const adminApiKey = process.env.ALGOLIA_ADMIN_KEY
const productsIndexName = process.env.ALGOLIA_INDEX_NAME ?? "products"

function getAlgoliaClient() {
  if (!appId || !searchApiKey || !adminApiKey) {
    throw new Error(
      "Algolia is not configured. Set NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY, and ALGOLIA_INDEX_NAME."
    )
  }

  return algoliasearch(appId, adminApiKey)
}

const productsIndex = {
  async saveObject(body: {
    objectID: string
    name: string
    slug: string
    description: string
    price: number
    comparePrice?: number | null
    image: string | null
    stock: number
    isActive: boolean
    category: string
    categorySlug: string
  }) {
    const client = getAlgoliaClient()
    return client.saveObject({
      indexName: productsIndexName,
      body,
    })
  },
  async deleteObject(objectID: string) {
    const client = getAlgoliaClient()
    return client.deleteObject({
      indexName: productsIndexName,
      objectID,
    })
  },
}

export async function syncProductToAlgolia(product: AlgoliaProductInput) {
  await productsIndex.saveObject({
    objectID: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice,
    image: product.images[0] ?? null,
    stock: product.stock,
    isActive: product.isActive,
    category: product.category.name,
    categorySlug: product.category.slug,
  })
}

export async function deleteProductFromAlgolia(productId: string) {
  await productsIndex.deleteObject(productId)
}
