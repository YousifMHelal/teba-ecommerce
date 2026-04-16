import {
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Tag,
  User,
  Users
} from "lucide-react";


export const EGYPT_GOVERNORATES = [
  "القاهرة",
  "القليوبية",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];

export const STATUS_COLORS: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}
export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}
export const APP_NAME = "طيبة"
export const APP_DESCRIPTION = "متجر طيبة الإلكتروني — تسوق بسهولة وأمان"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

export const ITEMS_PER_PAGE = 24
export const SHIPPING_THRESHOLD = 20000
export const SHIPPING_COST = 100

// Product Image Placeholders
export const PRODUCT_PLACEHOLDER_DEFAULT = "/assets/product-placeholder-default.svg"
export const PRODUCT_PLACEHOLDER_SURFACTANTS = "/assets/product-placeholder-surfactants.svg"
export const PRODUCT_PLACEHOLDER_ACIDS = "/assets/product-placeholder-acids.svg"
export const PRODUCT_PLACEHOLDER_PERFUMES = "/assets/product-placeholder-perfumes.svg"
export const PRODUCT_PLACEHOLDER_PACKAGING = "/assets/product-placeholder-packaging.svg"

export const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "الفئات" },
  { href: "/search", label: "البحث" },
  { href: "/about", label: "من نحن" },
] as const;

export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الفئات", icon: Tag },
  { href: "/admin/homepage", label: "المنتاجات المميزة", icon: Sparkles },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
] as const;

export const ACCOUNT_NAV_LINKS = [
  { href: "/profile", label: "الملف الشخصي", icon: User },
  { href: "/orders", label: "طلباتي", icon: Package },
  { href: "/addresses", label: "عناويني", icon: MapPin },
] as const;

export const PAYMENT_METHODS = [
  {
    id: "INSTAPAY",
    label: "Instapay",
    description: "ادفع عبر Instapay وأدخل رقم المرجع",
    icon: "💳",
    requiresReference: true,
    instructions:
      "حوّل المبلغ إلى حساب Instapay: 01110292946 ثم أدخل رقم العملية أدناه",
  },
  {
    id: "VODAFONE_CASH",
    label: "Vodafone Cash",
    description: "ادفع عبر Vodafone Cash وأدخل رقم المرجع",
    icon: "📱",
    requiresReference: true,
    instructions:
      "حوّل المبلغ إلى محفظة Vodafone Cash: 01050991860 ثم أدخل رقم العملية أدناه",
  },
  {
    id: "PAY_ON_DELIVERY",
    label: "الدفع عند الاستلام",
    description: "ادفع نقداً عند استلام طلبك",
    icon: "🚚",
    requiresReference: false,
    instructions: null,
  },
] as const

export const ORDER_STATUS = {
  PENDING: "قيد الانتظار",
  PROCESSING: "قيد المعالجة",
  SHIPPED: "جاري الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
} as const

export const PAYMENT_STATUS = {
  UNPAID: "منتظر التأكيد",
  PAID: "مدفوع",
  REFUNDED: "مسترجع",
} as const

export const PAYMENT_METHOD_LABELS = {
  INSTAPAY: "Instapay",
  VODAFONE_CASH: "Vodafone Cash",
  PAY_ON_DELIVERY: "الدفع عند الاستلام",
} as const

export const SORT_OPTIONS = [
  { label: "الأحدث", value: "createdAt_desc" },
  { label: "الأقدم", value: "createdAt_asc" },
  { label: "السعر: من الأقل", value: "price_asc" },
  { label: "السعر: من الأعلى", value: "price_desc" },
  { label: "الأكثر مبيعاً", value: "sales_desc" },
] as const

export const appName = APP_NAME
