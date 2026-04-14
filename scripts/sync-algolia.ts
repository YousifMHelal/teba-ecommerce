import { PrismaClient } from "@prisma/client"
import { algoliasearch } from "algoliasearch"
import nextEnv from "@next/env"

const prisma = new PrismaClient()
const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())

async function main() {
  const appId = process.env.ALGOLIA_APP_ID ?? process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY ?? process.env.ALGOLIA_ADMIN_KEY
  const indexName =
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? process.env.ALGOLIA_INDEX_NAME

  if (!appId || !adminKey || !indexName) {
    throw new Error(
      "Missing Algolia env vars. Required: ALGOLIA_APP_ID/NEXT_PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY/ALGOLIA_ADMIN_KEY, and NEXT_PUBLIC_ALGOLIA_INDEX_NAME/ALGOLIA_INDEX_NAME."
    )
  }

  const client = algoliasearch(
    appId,
    adminKey
  )

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
  })

  // Ensure the index exists even when there are no products to push yet.
  await client.setSettings({
    indexName,
    indexSettings: {
      searchableAttributes: ["name", "description", "categoryName"],
    },
  })

  await client.saveObjects({
    indexName,
    objects: products.map((p) => ({
      objectID: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice,
      image: p.images[0] ?? null,
      stock: p.stock,
      categoryName: p.category.name,
      categorySlug: p.category.slug,
    })),
  })

  console.log(`Synced ${products.length} products to Algolia`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
