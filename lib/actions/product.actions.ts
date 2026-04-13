"use server"

import { prisma } from "@/lib/prisma"
import {
  deleteProductFromAlgolia,
  syncProductToAlgolia,
  type AlgoliaProductInput,
} from "@/lib/algolia"

export async function getProductsAction(params?: { limit?: number }) {
  try {
    const limit = params?.limit ?? 8
    const products = await prisma.product.findMany({
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductBySlugAction(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        comparePrice: true,
        images: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
    return product
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

export async function syncProductToAlgoliaAction(product: AlgoliaProductInput) {
  await syncProductToAlgolia(product)
}

export async function deleteProductFromAlgoliaAction(productId: string) {
  await deleteProductFromAlgolia(productId)
}
