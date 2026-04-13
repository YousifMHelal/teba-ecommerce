"use server"

import { Prisma } from "@prisma/client"
import { hash } from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

type RegisterUserInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export async function registerUser(data: RegisterUserInput) {
  const parsed = registerSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى",
    }
  }

  const { name, email, password } = parsed.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        success: false,
        error: "البريد الإلكتروني مسجل مسبقاً",
      }
    }

    const hashedPassword = await hash(password, 12)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error: "البريد الإلكتروني مسجل مسبقاً",
        }
      }

      if (error.code === "P1001") {
        return {
          success: false,
          error: "تعذر الاتصال بقاعدة البيانات، حاول مرة أخرى",
        }
      }
    }

    console.error("registerUser failed:", error)

    return {
      success: false,
      error: "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى",
    }
  }
}

export async function registerUserAction(input: RegisterUserInput) {
  return registerUser(input)
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

export async function updateProfile(id: string, data: { name?: string; image?: string }) {
  try {
    await prisma.user.update({
      where: { id },
      data,
    })

    return { success: true }
  } catch {
    return {
      success: false,
      error: "حدث خطأ أثناء تحديث الملف الشخصي",
    }
  }
}
export async function getUsersAction() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })
}
