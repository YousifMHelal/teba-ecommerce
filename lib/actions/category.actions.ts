"use server"

import { prisma } from "@/lib/prisma"

export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return categories
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getCategoryBySlugAction(slug: string) {
  return { slug }
}
