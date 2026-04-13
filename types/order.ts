import {
  Order,
  OrderItem,
  Product,
  ProductVariant,
  User,
} from "@prisma/client"

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
    variant: ProductVariant | null
  })[]
  user: Pick<User, "id" | "name" | "email">
}

export type ShippingAddress = {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode?: string
}
