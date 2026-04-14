"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/actions/user.actions"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmNewPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmNewPassword"],
  })

type FormData = z.infer<typeof passwordSchema>

export default function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(passwordSchema) })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setMessage(null)

    const result = await updatePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })

    if (result.success) {
      setMessage({ type: "success", text: "تم تغيير كلمة المرور بنجاح" })
      reset()
    } else {
      setMessage({ type: "error", text: result.error ?? "حدث خطأ ما" })
    }

    setIsLoading(false)
  }

  return (
    <div className="rounded-xl border bg-background p-5 space-y-4">
      <h2 className="font-semibold text-sm">تغيير كلمة المرور</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              dir="ltr"
              className="pr-10"
              {...register("currentPassword")}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showCurrentPassword ? "إخفاء كلمة المرور الحالية" : "إظهار كلمة المرور الحالية"}
            >
              {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-destructive text-xs">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              dir="ltr"
              className="pr-10"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showNewPassword ? "إخفاء كلمة المرور الجديدة" : "إظهار كلمة المرور الجديدة"}
            >
              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-destructive text-xs">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
          <div className="relative">
            <Input
              id="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              dir="ltr"
              className="pr-10"
              {...register("confirmNewPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.confirmNewPassword && (
            <p className="text-destructive text-xs">{errors.confirmNewPassword.message}</p>
          )}
        </div>

        {message && (
          <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
            {message.text}
          </p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "تحديث كلمة المرور"}
        </Button>
      </form>
    </div>
  )
}
