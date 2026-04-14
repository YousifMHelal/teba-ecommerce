"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions/user.actions"

type FormData = { name: string }

export default function ProfileForm({
  user,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null }
}) {
  const { update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user.image ?? "")
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: user.name ?? "" },
  })

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "الملف المختار ليس صورة صالحة" })
      return
    }

    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      setMessage({ type: "error", text: "حجم الصورة يجب ألا يتجاوز 5MB" })
      return
    }

    setIsUploading(true)
    setMessage(null)

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error("فشل قراءة الصورة"))
        reader.readAsDataURL(file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, folder: "avatars" }),
      })

      const result = await response.json()

      if (!response.ok || !result.url) {
        setMessage({ type: "error", text: result.error ?? "فشل رفع الصورة" })
        return
      }

      setImageUrl(result.url)
      setMessage({ type: "success", text: "تم رفع الصورة بنجاح" })
    } catch {
      setMessage({ type: "error", text: "فشل رفع الصورة، حاول مرة أخرى" })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setMessage(null)

    const result = await updateProfile({
      name: data.name,
      image: imageUrl.trim(),
    })

    if (result.success) {
      await update({ name: data.name, image: imageUrl.trim() || null })
      setMessage({ type: "success", text: "تم تحديث الملف الشخصي بنجاح" })
    } else {
      setMessage({ type: "error", text: result.error ?? "حدث خطأ ما" })
    }

    setIsLoading(false)
  }

  return (
    <div className="rounded-xl border bg-background p-5 space-y-5">
      <h2 className="font-semibold text-sm">المعلومات الشخصية</h2>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold capitalize">
            {user.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium capitalize">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input id="name" {...register("name", { required: "الاسم مطلوب" })} />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>البريد الإلكتروني</Label>
          <Input value={user.email ?? ""} disabled className="opacity-60" />
          <p className="text-xs text-muted-foreground">
            لا يمكن تغيير البريد الإلكتروني
          </p>
        </div>

        <div className="space-y-2">
          <Label>الصورة الشخصية</Label>
          <div className="rounded-xl border border-dashed p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={imageUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-base font-bold capitalize">
                    {user.name?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">صورة الحساب</p>
                  <p className="text-xs text-muted-foreground">
                    PNG / JPG حتى 5MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void handleImageUpload(file);
                    e.currentTarget.value = "";
                  }}
                  disabled={isUploading}
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => {
                    document.getElementById("imageFile")?.click();
                  }}>
                  <ImagePlus className="size-4" />
                  {imageUrl ? "تغيير الصورة" : "اختيار صورة"}
                </Button>

                {imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isUploading}
                    onClick={() => setImageUrl("")}>
                    <Trash2 className="size-4" />
                    إزالة
                  </Button>
                )}
              </div>
            </div>

            {isUploading && (
              <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                جاري رفع الصورة...
              </p>
            )}
          </div>
        </div>

        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
            {message.text}
          </p>
        )}

        <Button
          className="cursor-pointer"
          type="submit"
          disabled={isLoading || isUploading}>
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </form>
    </div>
  );
}
