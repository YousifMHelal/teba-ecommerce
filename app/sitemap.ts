import { prisma } from "@/lib/prisma"
import { APP_URL } from "@/lib/constants"

export default async function sitemap() {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
    where: { isActive: true },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  })

  return [
    { url: APP_URL, lastModified: new Date() },
    { url: `${APP_URL}/shop`, lastModified: new Date() },
    ...products.map((p) => ({
      url: `${APP_URL}/shop/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...categories.map((c) => ({
      url: `${APP_URL}/shop?category=${c.slug}`,
      lastModified: c.updatedAt,
    })),
  ]
}
