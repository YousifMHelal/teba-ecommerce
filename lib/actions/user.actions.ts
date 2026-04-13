import { hash } from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"

export async function registerUserAction(input: unknown) {
  const parsed = registerSchema.parse(input)
  const passwordHash = await hash(parsed.password, 12)

  return prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: passwordHash,
    },
  })
}

export async function getUsersAction() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })
}
