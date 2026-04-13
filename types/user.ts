import { Address, Order, User } from "@prisma/client"

export type UserProfile = Pick<
  User,
  "id" | "name" | "email" | "image" | "role" | "createdAt"
>

export type AddressWithDefault = Address

export type UserWithOrders = User & {
  orders: Order[]
  addresses: Address[]
}
