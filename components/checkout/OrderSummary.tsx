"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/constants";

export default function OrderSummary() {
  const { items, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-xl border bg-background p-5 space-y-4 sticky top-24">
        <h2 className="font-bold text-base">ملخص الطلب</h2>
        <div className="space-y-3 max-h-64 overflow-y-auto" />
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{formatPrice(0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>{formatPrice(SHIPPING_COST)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>الإجمالي</span>
          <span>{formatPrice(SHIPPING_COST)}</span>
        </div>
      </div>
    );
  }

  const shippingCost = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="rounded-xl border bg-background p-5 space-y-4 sticky top-24">
      <h2 className="font-bold text-base">ملخص الطلب</h2>

      {/* Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => {
          const imageKey = `${item.id}-${item.variantId ?? "default"}`;
          const hasImage =
            typeof item.image === "string" &&
            item.image.trim().length > 0 &&
            !failedImages[imageKey];

          return (
            <div
              key={`${item.id}-${item.variantId}`}
              className="flex gap-3 items-start pt-1">
              <div className="relative h-14 w-14 shrink-0">
                <div className="relative h-full w-full rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={
                      hasImage ? item.image!.trim() : "/assets/placeholder.png"
                    }
                    alt="صورة المنتج"
                    fill
                    className="object-cover"
                    sizes="56px"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [imageKey]: true }))
                    }
                  />
                </div>
                <span className="absolute -top-1 -inset-e-1 z-10 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                {item.variantLabel && (
                  <p className="text-xs text-muted-foreground">
                    {item.variantLabel}
                  </p>
                )}
                <p className="text-sm font-bold mt-0.5">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المجموع الفرعي</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">الشحن</span>
          {shippingCost === 0 ? (
            <span className="text-green-600 font-medium">
              مجاناً (فوق 20,000 ج.م)
            </span>
          ) : (
            <span>{formatPrice(shippingCost)}</span>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-base">
        <span>الإجمالي</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>
    </div>
  );
}
