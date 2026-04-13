"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { checkoutSchema, CheckoutInput } from "@/lib/validations";
import { createOrder } from "@/lib/actions/order.actions";
import { useCart } from "@/hooks/useCart";
import { PAYMENT_METHODS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

type CheckoutFormProps = {
  initialAddress?: {
    fullName?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } | null;
};

export default function CheckoutForm({
  initialAddress = null,
}: CheckoutFormProps) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: initialAddress?.fullName ?? "",
      phone: initialAddress?.phone ?? "",
      street: initialAddress?.street ?? "",
      city: initialAddress?.city ?? "",
      state: initialAddress?.state ?? "",
      country: initialAddress?.country ?? "مصر",
      postalCode: initialAddress?.postalCode ?? "",
      paymentMethod: "PAY_ON_DELIVERY",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const selectedMethodInfo = PAYMENT_METHODS.find(
    (m) => m.id === paymentMethod,
  );

  const onSubmit = async (data: CheckoutInput) => {
    setIsLoading(true);
    setError("");

    const result = await createOrder(items, data);

    if (!result.success) {
      setError(result.error || "حدث خطأ ما");
      setIsLoading(false);
      return;
    }

    clearCart();
    router.push(`/checkout/success?orderId=${result.orderId}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* Shipping Address */}
      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="font-bold text-base flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            ١
          </span>
          عنوان التوصيل
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              placeholder="محمد أحمد"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-destructive text-xs">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">رقم الهاتف</Label>
            <Input
              id="phone"
              placeholder="01XXXXXXXXX"
              dir="ltr"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-destructive text-xs">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="state">المحافظة</Label>
            <select
              id="state"
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("state")}>
              <option value="">اختر المحافظة</option>
              {EGYPT_GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-destructive text-xs">{errors.state.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="city">المدينة / الحي</Label>
            <Input id="city" placeholder="مدينة نصر" {...register("city")} />
            {errors.city && (
              <p className="text-destructive text-xs">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="street">العنوان التفصيلي</Label>
          <Input
            id="street"
            placeholder="اسم الشارع، رقم المبنى، الطابق"
            {...register("street")}
          />
          {errors.street && (
            <p className="text-destructive text-xs">{errors.street.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">
            ملاحظات للطلب{" "}
            <span className="text-muted-foreground text-xs">(اختياري)</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="أي تعليمات خاصة للتوصيل..."
            rows={2}
            {...register("notes")}
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="font-bold text-base flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
            ٢
          </span>
          طريقة الدفع
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  setValue("paymentMethod", method.id as any, {
                    shouldValidate: true,
                  });
                }}
                className={cn(
                  "w-full flex items-start gap-3 p-4 rounded-xl border text-start transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50",
                )}>
                <div
                  className={cn(
                    "mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-primary" : "border-muted-foreground",
                  )}>
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{method.icon}</span>
                    <span className="font-medium text-sm">{method.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {method.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment instructions + reference input */}
        {selectedMethodInfo?.requiresReference && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 space-y-3">
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {selectedMethodInfo.instructions}
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="paymentReference">رقم العملية / المرجع</Label>
              <Input
                id="paymentReference"
                placeholder="أدخل رقم العملية"
                dir="ltr"
                {...register("paymentReference")}
              />
              {errors.paymentReference && (
                <p className="text-destructive text-xs">
                  {errors.paymentReference.message}
                </p>
              )}
            </div>
          </div>
        )}

        {paymentMethod === "PAY_ON_DELIVERY" && (
          <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✓ ستدفع المبلغ نقداً عند استلام طلبك
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 text-center">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full cursor-pointer"
        disabled={isLoading || items.length === 0}>
        {isLoading ? "جاري إنشاء الطلب..." : "تأكيد الطلب"}
      </Button>
    </form>
  );
}
