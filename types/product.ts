import { Product, ProductVariant, Category } from "@prisma/client"

export type ProductWithCategory = Product & {
  category: Category
}

export type ProductWithVariants = Product & {
  variants: ProductVariant[]
  category: Category
}

export type ProductCardType = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  stock: number
  category: {
    name: string
    slug: string
  }
}

export type ProductFiltersType = {
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  search?: string
  includeInactive?: boolean
}
