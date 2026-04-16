"use server"

import { randomUUID } from "crypto"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import { ProductFiltersType } from "@/types"
import slugify from "slugify"
import { algoliasearch } from "algoliasearch"

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_ADMIN_API_KEY!
)

const ALGOLIA_INDEX = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "teba_products"


export async function getProducts(filters: ProductFiltersType = {}) {
  const {
    categorySlug,
    search,
    minPrice,
    maxPrice,
    sort = "createdAt_desc",
    page = 1,
    includeInactive = false,
  } = filters

  const sortMap = {
    createdAt_desc: { createdAt: "desc" as const },
    createdAt_asc: { createdAt: "asc" as const },
    price_desc: { price: "desc" as const },
    price_asc: { price: "asc" as const },
    // Fallback until a dedicated sales metric exists in the Product model.
    sales_desc: { createdAt: "desc" as const },
  }

  const orderBy = sortMap[sort as keyof typeof sortMap] ?? sortMap.createdAt_desc

  const where = {
    ...(includeInactive ? {} : { isActive: true }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
            { category: { name: { contains: search, mode: "insensitive" as const } } },
            { category: { slug: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }
      : {}),
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    pages: Math.ceil(total / ITEMS_PER_PAGE),
    page,
  }
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      variants: true,
      reviews: {
        include: {
          user: { select: { name: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: excludeId },
      isActive: true,
    },
    include: { category: true },
    take: 4,
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  })
}

export async function getHomepageFeaturedProductSlots() {
  return prisma.$queryRaw<Array<{
    id: string
    position: number
    productId: string
  }>>`
    SELECT id, "position", "productId"
    FROM "HomepageFeaturedProduct"
    ORDER BY "position" ASC
  `
}

export async function getHomepageFeaturedProducts() {
  const featured = await getHomepageFeaturedProductSlots()

  if (featured.length > 0) {
    const featuredIds = featured.map((entry) => entry.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: featuredIds },
        isActive: true,
      },
      include: { category: true },
    })

    return featuredIds
      .map((productId) => products.find((product) => product.id === productId))
      .filter((product): product is (typeof products)[number] => Boolean(product))
  }

  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  })
}

export async function createProduct(data: {
  name: string
  description: string
  price: number
  comparePrice?: number
  images?: string[]
  stock: number
  categoryId: string
  variants?: { name: string; value: string; priceAdjustment: number; stock: number }[]
}) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  const slug = slugify(data.name, { lower: true, strict: true })

  const { variants, ...productData } = data

  const product = await prisma.product.create({
    data: {
      ...productData,
      slug,
      ...(variants && {
        variants: { create: variants },
      }),
    },
    include: {
      variants: true,
      category: true, // ✅ FIXED
    },
  })

  await syncProductToAlgolia(product)

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
  return product
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string
    description: string
    price: number
    comparePrice: number
    images: string[]
    stock: number
    isActive: boolean
    categoryId: string
  }>
) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  const updateData: typeof data & { slug?: string } = { ...data }

  if (data.name) {
    updateData.slug = slugify(data.name, { lower: true, strict: true })
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true },
  })

  await syncProductToAlgolia(product)

  revalidatePath("/admin/products")
  revalidatePath(`/shop/${product.slug}`)
  revalidatePath("/shop")
  revalidatePath("/")
  return product
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  await prisma.product.delete({ where: { id } })

  await deleteProductFromAlgolia(id)

  revalidatePath("/admin/products")
  revalidatePath("/shop")
  revalidatePath("/")
  return { success: true }
}

export async function saveHomepageFeaturedProducts(
  _: { success: boolean; message: string | null },
  formData: FormData
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "غير مصرح" }
  }

  const productIds = [1, 2, 3, 4]
    .map((slot) => String(formData.get(`product-${slot}`) ?? "").trim())
    .filter(Boolean)

  const uniqueIds = [...new Set(productIds)]

  if (uniqueIds.length !== 4) {
    return {
      success: false,
      message: "يجب اختيار 4 منتجات مختلفة للصفحة الرئيسية",
    }
  }

  const products = await prisma.product.findMany({
    where: {
      id: { in: uniqueIds },
      isActive: true,
    },
    select: { id: true },
  })

  if (products.length !== 4) {
    return {
      success: false,
      message: "كل المنتجات المختارة يجب أن تكون منشورة وموجودة",
    }
  }

  const now = new Date()

  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`DELETE FROM "HomepageFeaturedProduct"`

    for (const [index, productId] of uniqueIds.entries()) {
      await tx.$executeRaw`
        INSERT INTO "HomepageFeaturedProduct" ("id", "position", "productId", "createdAt", "updatedAt")
        VALUES (${randomUUID()}, ${index + 1}, ${productId}, ${now}, ${now})
      `
    }
  })

  revalidatePath("/")
  revalidatePath("/admin/homepage")

  return { success: true, message: "تم حفظ المنتجات المميزة بنجاح" }
}

async function syncProductToAlgolia(product: {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number | null
  images: string[]
  stock: number
  categoryId: string
  category?: { name: string; slug: string } | null
}) {
  try {
    await algoliaClient.saveObjects({
      indexName: ALGOLIA_INDEX,
      objects: [
        {
          objectID: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          image: product.images?.[0] ?? null,
          stock: product.stock,
          categoryName: product.category?.name ?? "",
          categorySlug: product.category?.slug ?? "",
        },
      ],
    })
  } catch (err) {
    console.error("Algolia sync failed:", err)
  }
}

async function deleteProductFromAlgolia(id: string) {
  try {
    await algoliaClient.deleteObject({
      indexName: ALGOLIA_INDEX,
      objectID: id,
    })
  } catch (err) {
    console.error("Algolia delete failed:", err)
  }
}

export async function syncAllProductsToAlgolia() {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
  })

  await algoliaClient.saveObjects({
    indexName: ALGOLIA_INDEX,
    objects: products.map((product) => ({
      objectID: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images?.[0] ?? null,
      stock: product.stock,
      categoryName: product.category?.name ?? "",
      categorySlug: product.category?.slug ?? "",
    })),
  })

  return { synced: products.length, products }
}

export async function getProductsAction(params?: { limit?: number }) {
  if (params?.limit) {
    return prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: params.limit,
    })
  }

  return getProducts()
}
