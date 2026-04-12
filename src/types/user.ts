export type UserRole = "CUSTOMER" | "ADMIN"

export type User = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
}
