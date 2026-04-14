"use server"

import { prisma } from "@/lib/prisma"
import { DEFAULT_PRODUCT_PLACEHOLDER } from "@/lib/product-placeholders"

export async function validateProductImages() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    const productsWithoutImages = products.filter(
      (p) => !p.images || p.images.length === 0
    )

    const productsWithInvalidImages = products.filter(
      (p) =>
        p.images &&
        p.images.some((img) => !img || typeof img !== "string" || img.trim().length === 0)
    )

    return {
      success: true,
      totalProducts: products.length,
      productsWithImages: products.length - productsWithoutImages.length,
      productsWithoutImages: productsWithoutImages,
      productsWithInvalidImages: productsWithInvalidImages,
      allProductsHaveImages: productsWithoutImages.length === 0 && productsWithInvalidImages.length === 0,
      message:
        productsWithoutImages.length === 0 && productsWithInvalidImages.length === 0
          ? "✅ All products have valid images!"
          : `⚠️  Found ${productsWithoutImages.length} products without images and ${productsWithInvalidImages.length} with invalid images`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to validate product images",
      totalProducts: 0,
      productsWithImages: 0,
      productsWithoutImages: [],
      productsWithInvalidImages: [],
    }
  }
}

export async function addPlaceholderImagesToEmptyProducts() {
  try {
    const productsWithoutImages = await prisma.product.findMany({
      where: {
        OR: [
          { images: { isEmpty: true } },
          { images: { equals: [] } },
        ],
      },
      select: { id: true },
    })

    if (productsWithoutImages.length === 0) {
      return {
        success: true,
        message: "✅ All products already have images",
        updatedCount: 0,
      }
    }

    // Update products to have the default placeholder
    const result = await prisma.product.updateMany({
      where: {
        id: {
          in: productsWithoutImages.map((p) => p.id),
        },
      },
      data: {
        images: [DEFAULT_PRODUCT_PLACEHOLDER],
      },
    })

    return {
      success: true,
      message: `✅ Updated ${result.count} products with placeholder images`,
      updatedCount: result.count,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to add placeholder images",
      updatedCount: 0,
    }
  }
}

export async function cleanupInvalidProductImages() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        images: true,
      },
    })

    let updatedCount = 0

    for (const product of products) {
      if (!product.images) continue

      const validImages = product.images.filter(
        (img) => img && typeof img === "string" && img.trim().length > 0
      )

      if (validImages.length !== product.images.length) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            images:
              validImages.length > 0 ? validImages : [DEFAULT_PRODUCT_PLACEHOLDER],
          },
        })
        updatedCount++
      }
    }

    return {
      success: true,
      message: `✅ Cleaned up images for ${updatedCount} products`,
      cleanedCount: updatedCount,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to cleanup product images",
      cleanedCount: 0,
    }
  }
}
