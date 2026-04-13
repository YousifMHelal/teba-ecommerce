"use client"

import { useState } from "react"
import { Address } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from "@/lib/actions/user.actions"
import { addressSchema, AddressInput } from "@/lib/validations"

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "القليوبية",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحر الأحمر",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
];


export default function AddressesClient({
  initialAddresses,
}: {
  initialAddresses: Address[]
}) {
  const [addresses, setAddresses] = useState(initialAddresses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  })

  const openAddDialog = () => {
    setEditingAddress(null)
    reset({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      country: "مصر",
      postalCode: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (address: Address) => {
    setEditingAddress(address)
    reset({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode ?? "",
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true)
    setError("")

    const result = editingAddress
      ? await updateAddress(editingAddress.id, data)
      : await createAddress(data)

    if (result.success) {
      setIsDialogOpen(false)
      window.location.reload()
    } else {
      setError(result.error ?? "حدث خطأ ما")
    }

    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنوان؟")) return
    const result = await deleteAddress(id)
    if (result.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    }
  }

  const handleSetDefault = async (id: string) => {
    const result = await setDefaultAddress(id)
    if (result.success) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    }
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed">
          <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">لم تضف أي عناوين بعد</p>
          <Button onClick={openAddDialog} size="sm">
            <Plus className="h-4 w-4 me-1.5" />
            إضافة عنوان
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-xl border p-4 space-y-2 relative ${
                  address.isDefault ? "border-primary bg-primary/5" : "bg-background"
                }`}
              >
                {address.isDefault && (
                  <Badge className="absolute top-3 inset-e-3 text-xs">افتراضي</Badge>
                )}

                <p className="font-medium text-sm">{address.fullName}</p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>{address.street}</p>
                  <p>
                    {address.city}، {address.state}، {address.country}
                  </p>
                  <p dir="ltr">{address.phone}</p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {!address.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-3 w-3" />
                      تعيين افتراضي
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ms-auto"
                    onClick={() => openEditDialog(address)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={openAddDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة عنوان جديد
          </Button>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "تعديل العنوان" : "إضافة عنوان جديد"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">الاسم الكامل</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-destructive text-xs">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input id="phone" dir="ltr" {...register("phone")} />
                {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="street">العنوان</Label>
              <Input id="street" {...register("street")} />
              {errors.street && <p className="text-destructive text-xs">{errors.street.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="state">المحافظة</Label>
                <select
                  id="state"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("state")}
                >
                  <option value="">اختر</option>
                  {EGYPT_GOVERNORATES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="text-destructive text-xs">{errors.state.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">المدينة</Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-destructive text-xs">{errors.city.message}</p>}
              </div>
            </div>

            {error && <p className="text-destructive text-sm text-center">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
