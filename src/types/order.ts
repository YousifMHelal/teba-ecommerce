export type Order = {
  id: string
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  total: number
}
