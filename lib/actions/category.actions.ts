"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import slugify from "slugify"

export async function getCategories(search = "") {
  return prisma.category.findMany({
    where: search
      ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
      : undefined,
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  })
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  })
}

export async function createCategory(data: {
  name: string
  image?: string
}) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  const slug = slugify(data.name, { lower: true, strict: true })

  const category = await prisma.category.create({
    data: { ...data, slug },
  })

  revalidatePath("/admin/categories")
  revalidatePath("/shop")
  return category
}

export async function updateCategory(
  id: string,
  data: { name?: string; image?: string }
) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  const updateData: { name?: string; image?: string; slug?: string } = { ...data }
  if (data.name) {
    updateData.slug = slugify(data.name, { lower: true, strict: true })
  }

  const category = await prisma.category.update({
    where: { id },
    data: updateData,
  })

  revalidatePath("/admin/categories")
  revalidatePath("/shop")
  return category
}

export async function deleteCategory(id: string) {
  const session = await auth()
  if (session?.user.role !== "ADMIN") throw new Error("غير مصرح")

  await prisma.category.delete({ where: { id } })

  revalidatePath("/admin/categories")
  revalidatePath("/shop")
  return { success: true }
}

export const getCategoriesAction = getCategories
