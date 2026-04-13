export const APP_NAME = "طيبة"
export const APP_DESCRIPTION = "متجر طيبة الإلكتروني — تسوق بسهولة وأمان"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export const ITEMS_PER_PAGE = 12

export const ORDER_STATUS = {
  PENDING: "قيد الانتظار",
  PROCESSING: "قيد المعالجة",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
} as const

export const PAYMENT_STATUS = {
  UNPAID: "غير مدفوع",
  PAID: "مدفوع",
  REFUNDED: "مسترجع",
} as const

export const SORT_OPTIONS = [
  { label: "الأحدث", value: "createdAt_desc" },
  { label: "الأقدم", value: "createdAt_asc" },
  { label: "السعر: من الأقل", value: "price_asc" },
  { label: "السعر: من الأعلى", value: "price_desc" },
  { label: "الأكثر مبيعاً", value: "sales_desc" },
] as const

export const appName = APP_NAME

export const navigationLinks = [
  { href: "/shop", label: "المتجر" },
  { href: "/categories/new-arrivals", label: "الفئات" },
  { href: "/cart", label: "السلة" },
  { href: "/search", label: "البحث" },
] as const

export const accountLinks = [
  { href: "/account/profile", label: "الملف الشخصي" },
  { href: "/account/orders", label: "الطلبات" },
  { href: "/account/addresses", label: "العناوين" },
] as const

export const adminLinks = [
  { href: "/admin", label: "لوحة التحكم" },
  { href: "/admin/products", label: "المنتجات" },
  { href: "/admin/categories", label: "الفئات" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/users", label: "المستخدمون" },
] as const

export const sampleProducts = [
  {
    id: "sample-1",
    slug: "sample-product-1",
    name: "منتج تجريبي 1",
    description: "وصف منتج تجريبي",
    price: 100,
    category: "عام",
  },
  {
    id: "sample-2",
    slug: "sample-product-2",
    name: "منتج تجريبي 2",
    description: "وصف منتج تجريبي",
    price: 150,
    category: "عام",
  },
] as const
