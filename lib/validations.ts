import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "البريد الإلكتروني مطلوب")
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
})

export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب").min(2, "الاسم يجب أن يكون حرفين على الأقل"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صالح"),
    password: z.string().min(1, "كلمة المرور مطلوبة").min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  })

export const profileSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  image: z.string().trim().url("رابط الصورة غير صالح").optional().or(z.literal("")),
})

export const addressSchema = z.object({
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صالح"),
  street: z.string().min(1, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  state: z.string().min(1, "المحافظة مطلوبة"),
  country: z.string().min(1, "الدولة مطلوبة"),
  postalCode: z.string().optional(),
})

export const checkoutSchema = z
  .object({
    fullName: z.string().min(1, "الاسم الكامل مطلوب"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^01[0125][0-9]{8}$/, "رقم الهاتف غير صالح"),
    street: z.string().min(1, "العنوان مطلوب"),
    city: z.string().min(1, "المدينة مطلوبة"),
    state: z.string().min(1, "المحافظة مطلوبة"),
    country: z.string().min(1, "الدولة مطلوبة"),
    postalCode: z.string().optional(),
    paymentMethod: z.enum(["INSTAPAY", "VODAFONE_CASH", "PAY_ON_DELIVERY"]),
    paymentReference: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        data.paymentMethod === "INSTAPAY" ||
        data.paymentMethod === "VODAFONE_CASH"
      ) {
        return !!data.paymentReference && data.paymentReference.trim().length > 3
      }
      return true
    },
    {
      message: "رقم المرجع مطلوب لهذه الطريقة",
      path: ["paymentReference"],
    }
  )

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
