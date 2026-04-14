"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { checkoutSchema } from "@/lib/validations"
import { SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants"
import { CartItem } from "@/store/cartStore"

export async function createOrder(
  cartItems: CartItem[],
  formData: {
    fullName: string
    phone: string
    street: string
    city: string
    state: string
    country: string
    postalCode?: string
    paymentMethod: "INSTAPAY" | "VODAFONE_CASH" | "PAY_ON_DELIVERY"
    paymentReference?: string
    notes?: string
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "يجب تسجيل الدخول أولاً" }
  }

  const parsed = checkoutSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "البيانات غير صحيحة" }
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "السلة فارغة" }
  }

  try {
    // Verify stock for all items
    for (const item of cartItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { stock: true, name: true },
      })
      if (!product || product.stock < item.quantity) {
        return {
          success: false,
          error: `المنتج "${item.name}" غير متوفر بالكمية المطلوبة`,
        }
      }
    }

    const itemsTotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const shippingCost =
      itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = itemsTotal + shippingCost

    const {
      fullName,
      phone,
      street,
      city,
      state,
      country,
      postalCode,
      paymentMethod,
      paymentReference,
      notes,
    } = parsed.data

    // Create order + items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          total,
          shippingAddress: { fullName, phone, street, city, state, country, postalCode },
          paymentMethod,
          paymentReference: paymentReference ?? null,
          paymentStatus:
            paymentMethod === "PAY_ON_DELIVERY" ? "UNPAID" : "UNPAID",
          notes: notes ?? null,
          status: "PENDING",
          items: {
            create: cartItems.map((item) => ({
              productId: item.id,
              variantId: item.variantId ?? null,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      // Decrement stock for each item
      for (const item of cartItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        } else {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      return newOrder
    })

    revalidatePath("/orders")
    revalidatePath("/admin/orders")

    return { success: true, orderId: order.id }
  } catch (err) {
    console.error("createOrder error:", err)
    return { success: false, error: "حدث خطأ أثناء إنشاء الطلب، حاول مرة أخرى" }
  }
}

export async function getMyOrders() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: { select: { name: true, images: true, slug: true } },
          variant: { select: { name: true, value: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getOrderById(id: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.order.findFirst({
    where: {
      id,
      // Admin can see all, users only their own
      ...(session.user.role !== "ADMIN" && { userId: session.user.id }),
    },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
      user: { select: { id: true, name: true, email: true } },
    },
  })
}

export async function updateOrderStatus(
  id: string,
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("غير مصرح")

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  })

  revalidatePath(`/admin/orders/${id}`)
  revalidatePath("/admin/orders")
  revalidatePath(`/orders/${id}`)
  return order
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED"
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("غير مصرح")

  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus },
  })

  revalidatePath(`/admin/orders/${id}`)
  revalidatePath("/admin/orders")
  return order
}

export async function cancelAndDeleteMyOrder(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "يجب تسجيل الدخول أولاً" }
  }

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    select: {
      id: true,
      status: true,
    },
  })

  if (!order) {
    return { success: false, error: "الطلب غير موجود" }
  }

  if (order.status === "SHIPPED" || order.status === "DELIVERED") {
    return {
      success: false,
      error: "لا يمكن إلغاء أو حذف الطلب بعد الشحن أو التوصيل",
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      })

      await tx.order.delete({ where: { id } })
    })

    revalidatePath("/orders")
    revalidatePath(`/orders/${id}`)
    revalidatePath("/admin/orders")
    revalidatePath(`/admin/orders/${id}`)

    return { success: true }
  } catch (error) {
    console.error("cancelAndDeleteMyOrder error:", error)
    return { success: false, error: "تعذر إلغاء وحذف الطلب، حاول مرة أخرى" }
  }
}

export async function getAllOrders(
  page = 1,
  filters?: {
    search?: string
    status?: string
    paymentStatus?: string
    paymentMethod?: string
  }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("غير مصرح")

  const PAGE_SIZE = 20
  const where = {
    ...(filters?.status ? { status: filters.status as any } : {}),
    ...(filters?.paymentStatus
      ? { paymentStatus: filters.paymentStatus as any }
      : {}),
    ...(filters?.paymentMethod
      ? { paymentMethod: filters.paymentMethod as any }
      : {}),
    ...(filters?.search
      ? {
        OR: [
          { id: { contains: filters.search, mode: "insensitive" as const } },
          {
            user: {
              OR: [
                {
                  name: {
                    contains: filters.search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  email: {
                    contains: filters.search,
                    mode: "insensitive" as const,
                  },
                },
              ],
            },
          },
          {
            paymentReference: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
          {
            notes: {
              contains: filters.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
      : {}),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        items: { select: { quantity: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total, pages: Math.ceil(total / PAGE_SIZE) }
}
