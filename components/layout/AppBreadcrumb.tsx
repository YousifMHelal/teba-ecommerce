"use client"

import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const ROUTE_LABELS: Record<string, string> = {
  admin: "لوحة التحكم",
  account: "حسابي",
  addresses: "العناوين",
  orders: "الطلبات",
  profile: "الملف الشخصي",
  categories: "الأقسام",
  products: "المنتجات",
  users: "المستخدمون",
  cart: "السلة",
  checkout: "الدفع",
  search: "البحث",
  shop: "المتجر",
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
}

function formatSegment(segment: string) {
  const cleanSegment = decodeURIComponent(segment)
  if (ROUTE_LABELS[cleanSegment]) {
    return ROUTE_LABELS[cleanSegment]
  }

  if (/^[0-9]+$/.test(cleanSegment)) {
    return `#${cleanSegment}`
  }

  return cleanSegment.replace(/[-_]+/g, " ")
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const isProductDetailsPage = segments.length === 2 && segments[0] === "shop"

  if (segments.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`
              const isLast = index === segments.length - 1
              const label =
                isProductDetailsPage && isLast
                  ? "تفاصيل المنتج"
                  : formatSegment(segment)

              return [
                <BreadcrumbSeparator key={`${href}-separator`}>
                  <ChevronLeft className="size-4" />
                </BreadcrumbSeparator>,
                <BreadcrumbItem key={href}>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>,
              ]
            })}
          </BreadcrumbList>
        </Breadcrumb>
    </div>
  )
}
