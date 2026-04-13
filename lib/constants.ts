export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Teba"

export const navigationLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/categories/new-arrivals", label: "Categories" },
  { href: "/cart", label: "Cart" },
  { href: "/search", label: "Search" },
] as const

export const accountLinks = [
  { href: "/account/profile", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
] as const

export const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
] as const

export const sampleProducts = [
  {
    id: "prod-1",
    slug: "everyday-overshirt",
    name: "Everyday Overshirt",
    description: "Structured layers for a clean, modern wardrobe.",
    price: 128,
    category: "Apparel",
  },
  {
    id: "prod-2",
    slug: "field-canvas-bag",
    name: "Field Canvas Bag",
    description: "Durable carry-all with weather-resistant finish.",
    price: 92,
    category: "Accessories",
  },
  {
    id: "prod-3",
    slug: "glass-tumbler-set",
    name: "Glass Tumbler Set",
    description: "Minimal tableware with a tactile silhouette.",
    price: 54,
    category: "Home",
  },
  {
    id: "prod-4",
    slug: "linen-weekend-shirt",
    name: "Linen Weekend Shirt",
    description: "Breathable everyday shirt with a soft drape.",
    price: 74,
    category: "Apparel",
  },
] as const
