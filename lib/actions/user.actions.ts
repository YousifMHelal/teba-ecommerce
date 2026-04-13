"use server"

import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { addressSchema, profileSchema, registerSchema } from "@/lib/validations"

export async function registerUser(data: {
  name: string
  email: string
  password: string
  confirmPassword: string
}) {
  const parsed = registerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "البيانات غير صحيحة" }
  }

  const { name, email, password } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { success: false, error: "البريد الإلكتروني مسجل مسبقاً" }
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    })

    return { success: true }
  } catch {
    return { success: false, error: "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى" }
  }
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function updateProfile(data: { name?: string; image?: string }) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  const parsed = profileSchema.safeParse({
    name: data.name ?? "",
    image: data.image ?? "",
  })

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "البيانات غير صحيحة",
    }
  }

  const payload = {
    name: parsed.data.name,
    image: parsed.data.image ? parsed.data.image : null,
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: payload,
    })
    revalidatePath("/account/profile")
    return { success: true }
  } catch {
    return { success: false, error: "حدث خطأ أثناء تحديث الملف الشخصي" }
  }
}

export async function updatePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return {
        success: false,
        error: "هذا الحساب مرتبط بـ Google ولا يمكن تغيير كلمة المرور",
      }
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password)
    if (!isValid) {
      return { success: false, error: "كلمة المرور الحالية غير صحيحة" }
    }

    const hashed = await bcrypt.hash(data.newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    })

    return { success: true }
  } catch {
    return { success: false, error: "حدث خطأ أثناء تحديث كلمة المرور" }
  }
}

export async function getMyAddresses() {
  const session = await auth()
  if (!session?.user?.id) return []

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { id: "asc" }],
  })
}

export async function createAddress(data: {
  fullName: string
  phone: string
  street: string
  city: string
  state: string
  country: string
  postalCode?: string
}) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  const parsed = addressSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "البيانات غير صحيحة" }
  }

  try {
    const existing = await prisma.address.count({
      where: { userId: session.user.id },
    })

    const address = await prisma.address.create({
      data: {
        ...parsed.data,
        postalCode: parsed.data.postalCode ?? "",
        userId: session.user.id,
        isDefault: existing === 0,
      },
    })

    revalidatePath("/account/addresses")
    return { success: true, address }
  } catch {
    return { success: false, error: "حدث خطأ أثناء إضافة العنوان" }
  }
}

export async function updateAddress(
  id: string,
  data: {
    fullName?: string
    phone?: string
    street?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  try {
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    })

    if (!existingAddress) {
      return { success: false, error: "العنوان غير موجود" }
    }

    const address = await prisma.address.update({
      where: { id },
      data,
    })
    revalidatePath("/account/addresses")
    return { success: true, address }
  } catch {
    return { success: false, error: "حدث خطأ أثناء تحديث العنوان" }
  }
}

export async function deleteAddress(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  try {
    const deleted = await prisma.address.deleteMany({
      where: { id, userId: session.user.id },
    })

    if (deleted.count === 0) {
      return { success: false, error: "العنوان غير موجود" }
    }

    revalidatePath("/account/addresses")
    return { success: true }
  } catch {
    return { success: false, error: "حدث خطأ أثناء حذف العنوان" }
  }
}

export async function setDefaultAddress(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "غير مصرح" }
  }

  try {
    const ownedAddress = await prisma.address.findFirst({
      where: { id, userId: session.user.id },
      select: { id: true },
    })

    if (!ownedAddress) {
      return { success: false, error: "العنوان غير موجود" }
    }

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ])
    revalidatePath("/account/addresses")
    return { success: true }
  } catch {
    return { success: false, error: "حدث خطأ" }
  }
}

export async function getAllUsers(page = 1) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("غير مصرح")

  const PAGE_SIZE = 20
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count(),
  ])

  return { users, total, pages: Math.ceil(total / PAGE_SIZE) }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("غير مصرح")

  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/users")
  return { success: true }
}
