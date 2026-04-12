export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category?: string
  images?: string[]
  featured?: boolean
}
