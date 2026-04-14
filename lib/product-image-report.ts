/**
 * Product Image Status Report
 *
 * This is a utility script to help verify all products have images.
 * Run this in your Next.js API route handler or server action.
 *
 * Usage:
 * 1. Save this file
 * 2. Import and call from an API route or server action
 * 3. Check the console output or API response
 */

"use server"

import { prisma } from "@/lib/prisma"
import { DEFAULT_PRODUCT_PLACEHOLDER } from "@/lib/product-placeholders"

export async function getProductImageStatus() {
  console.log("\n📸 PRODUCT IMAGE STATUS REPORT\n")
  console.log("=" .repeat(60))

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  type StatusType = "✅ Has Images" | "❌ No Images" | "⚠️ Empty Array"

  const report = {
    totalProducts: products.length,
    productsWithImages: 0,
    productsWithoutImages: 0,
    productsWithEmptyArray: 0,
    details: [] as Array<{
      id: string
      name: string
      category: string
      imageCount: number
      status: StatusType
    }>,
  }

  products.forEach((product) => {
    let status: StatusType = "✅ Has Images"
    let imageCount = 0

    if (!product.images) {
      status = "❌ No Images"
      report.productsWithoutImages++
    } else if (product.images.length === 0) {
      status = "⚠️ Empty Array"
      report.productsWithEmptyArray++
    } else {
      imageCount = product.images.length
      report.productsWithImages++
    }

    report.details.push({
      id: product.id,
      name: product.name,
      category: product.category.name,
      imageCount,
      status,
    })
  })

  // Print summary
  console.log("\n📊 SUMMARY:")
  console.log(`Total Products: ${report.totalProducts}`)
  console.log(
    `✅ With Images: ${report.productsWithImages} (${((report.productsWithImages / report.totalProducts) * 100).toFixed(1)}%)`
  )
  console.log(
    `❌ Without Images: ${report.productsWithoutImages} (${((report.productsWithoutImages / report.totalProducts) * 100).toFixed(1)}%)`
  )
  console.log(
    `⚠️ Empty Arrays: ${report.productsWithEmptyArray} (${((report.productsWithEmptyArray / report.totalProducts) * 100).toFixed(1)}%)`
  )

  // Print details for problematic products
  const problemProducts = report.details.filter(
    (p) => p.status !== "✅ Has Images"
  )

  if (problemProducts.length > 0) {
    console.log("\n🚨 PRODUCTS WITHOUT IMAGES:")
    console.log("-".repeat(60))
    problemProducts.forEach((p) => {
      console.log(
        `[${p.status}] ${p.name} (Category: ${p.category}) - ID: ${p.id}`
      )
    })
  } else {
    console.log("\n✅ ALL PRODUCTS HAVE IMAGES!")
  }

  console.log("\n" + "=".repeat(60) + "\n")

  return report
}

/**
 * Fix products without images by adding placeholders
 */
export async function fixProductsWithoutImages() {
  console.log("\n🔧 FIXING PRODUCTS WITHOUT IMAGES\n")

  const productsToFix = await prisma.product.findMany({
    where: {
      OR: [
        { images: { isEmpty: true } },
        { images: { equals: null } },
      ],
    },
    select: {
      id: true,
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  if (productsToFix.length === 0) {
    console.log("✅ No products need fixing!")
    return { fixed: 0, failed: 0 }
  }

  let fixed = 0
  let failed = 0

  for (const product of productsToFix) {
    try {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: [DEFAULT_PRODUCT_PLACEHOLDER],
        },
      })
      console.log(`✅ Fixed: ${product.name}`)
      fixed++
    } catch (error) {
      console.error(`❌ Failed to fix: ${product.name}`, error)
      failed++
    }
  }

  console.log(
    `\n${fixed} products fixed, ${failed} failed\n`
  )

  return { fixed, failed }
}

/**
 * Generate a detailed HTML report of product images
 */
export async function generateProductImageReport() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  })

  let html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>تقرير صور المنتجات</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: right; border-bottom: 1px solid #ddd; }
        th { background: #06b6d4; color: white; font-weight: bold; }
        tr:hover { background: #f9f9f9; }
        .status-ok { color: green; font-weight: bold; }
        .status-missing { color: red; font-weight: bold; }
        .status-empty { color: orange; font-weight: bold; }
        .category-header { background: #f0f0f0; font-weight: bold; }
        .image-preview { max-width: 100px; max-height: 100px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📸 تقرير صور المنتجات</h1>
        <p>تم الإنشاء: ${new Date().toLocaleString("ar-EG")}</p>
        <p>إجمالي المنتجات: ${products.length}</p>
  `

  let currentCategory = ""

  products.forEach((product, index) => {
    if (product.category.name !== currentCategory) {
      currentCategory = product.category.name
      html += `
        <tr class="category-header">
          <td colspan="5">${currentCategory}</td>
        </tr>
      `
    }

    const imageCount = product.images?.length ?? 0
    const status =
      imageCount > 0
        ? `<span class="status-ok">✅ ${imageCount} صورة</span>`
        : `<span class="status-missing">❌ بدون صور</span>`

    if (index === 0 || product.category.name !== currentCategory) {
      html += '<table><thead><tr><th>المنتج</th><th>الفئة</th><th>الصور</th><th>المعرف</th></tr></thead><tbody>'
    }

    const imagePreview =
      product.images && product.images[0]
        ? `<img src="${product.images[0]}" alt="${product.name}" class="image-preview">`
        : ""

    html += `
      <tr>
        <td>${product.name}</td>
        <td>${product.category.name}</td>
        <td>${status}${imagePreview}</td>
        <td style="font-size: 0.8em; color: #666;">${product.id.slice(0, 8)}</td>
      </tr>
    `
  })

  html += `
        </tbody></table>
      </div>
    </body>
    </html>
  `

  return html
}
