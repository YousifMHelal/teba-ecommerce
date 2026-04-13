"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-4 h-20 w-20 text-muted-foreground/30" />
        <h1 className="mb-2 text-2xl font-bold">السلة فارغة</h1>
        <p className="mb-8 text-muted-foreground">
          لم تضف أي منتجات إلى سلة التسوق بعد
        </p>
        <Link
          href="/shop"
          className={cn(buttonVariants({ size: "lg" }), "inline-flex")}>
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">سلة التسوق</h1>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-destructive"
          onClick={clearCart}>
          <Trash2 className="h-4 w-4" />
          إفراغ السلة
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-1 divide-y overflow-hidden rounded-xl border bg-background lg:col-span-2">
          {items.map((item) => (
            <CartItem key={`${item.id}-${item.variantId}`} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
