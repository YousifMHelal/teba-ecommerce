"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function requireAdmin() {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    throw new Error("غير مصرح")
  }
}

export async function getDashboardStats() {
  await requireAdmin()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    revenueThisMonth,
    ordersThisMonth,
    newUsersThisMonth,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
        createdAt: { gte: thirtyDaysAgo },
      },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.user.count({
      where: {
        role: "USER",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ])

  return {
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalOrders,
    totalUsers,
    totalProducts,
    revenueThisMonth: revenueThisMonth._sum.total ?? 0,
    ordersThisMonth,
    newUsersThisMonth,
    pendingOrders,
  }
}

export async function getSalesChartData() {
  await requireAdmin()

  const sevenMonthsAgo = new Date()
  sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6)
  sevenMonthsAgo.setDate(1)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenMonthsAgo },
      paymentStatus: "PAID",
    },
    select: { total: true, createdAt: true },
  })

  const monthlyData: Record<string, { revenue: number; orders: number }> = {}

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - index)

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    monthlyData[key] = { revenue: 0, orders: 0 }
  }

  for (const order of orders) {
    const key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, "0")}`

    if (monthlyData[key]) {
      monthlyData[key].revenue += order.total
      monthlyData[key].orders += 1
    }
  }

  const arabicMonths = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ]

  return Object.entries(monthlyData).map(([key, value]) => {
    const [, month] = key.split("-")

    return {
      month: arabicMonths[Number.parseInt(month, 10) - 1],
      revenue: Math.round(value.revenue),
      orders: value.orders,
    }
  })
}

export async function getTopProducts() {
  await requireAdmin()

  const topItems = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    _count: { productId: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  })

  const products = await Promise.all(
    topItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { id: true, name: true, images: true, price: true },
      })

      if (!product) {
        return null
      }

      return {
        ...product,
        totalSold: item._sum.quantity ?? 0,
        totalOrders: item._count.productId,
      }
    })
  )

  return products.filter(
    (product): product is NonNullable<(typeof products)[number]> => product !== null
  )
}

export async function getRecentOrders() {
  await requireAdmin()

  return prisma.order.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { quantity: true } },
    },
  })
}

export async function getPaymentMethodStats() {
  await requireAdmin()

  const stats = await prisma.order.groupBy({
    by: ["paymentMethod"],
    _count: { paymentMethod: true },
    _sum: { total: true },
  })

  return stats.map((stat) => ({
    method: stat.paymentMethod,
    count: stat._count.paymentMethod,
    total: stat._sum.total ?? 0,
  }))
}
