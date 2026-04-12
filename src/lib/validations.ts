import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).max(80),
})

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  description: z.string().min(20),
  price: z.number().positive(),
  categoryId: z.string().optional(),
  featured: z.boolean().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
})

export const checkoutSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).optional(),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().min(2),
})
