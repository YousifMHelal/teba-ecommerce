"use client";

import Link from "next/link";
import { ShieldCheck, Truck } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SHIPPING_THRESHOLD = 20000;

export default function CartSummary({
  showCheckoutButton = true,
}: {
  showCheckoutButton?: boolean;
}) {
  const { totalPrice, totalItems } = useCart();
  const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : 100;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="sticky top-24 space-y-4 rounded-3xl border bg-background p-5">
      <h2 className="text-base font-bold">ملخص الطلب</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">المنتجات ({totalItems})</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">الشحن</span>
          {isFreeShipping ? (
            <span className="font-medium text-green-600">مجاناً</span>
          ) : (
            <span>{formatPrice(shippingCost)}</span>
          )}
        </div>

        {!isFreeShipping && (
          <p className="rounded-lg bg-muted/60 p-2 text-xs text-muted-foreground">
            أضف {formatPrice(SHIPPING_THRESHOLD - totalPrice)} للحصول على شحن
            مجاني
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between text-base font-bold">
        <span>الإجمالي</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>

      {showCheckoutButton && (
        <Button className="w-full" size="lg" asChild>
          <Link href="/checkout">إتمام الطلب</Link>
        </Button>
      )}

      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
          دفع آمن ومشفر
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-4 w-4 shrink-0 text-blue-600" />
          شحن سريع لجميع المحافظات
        </div>
      </div>
    </div>
  );
}
