"use client"

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";

import { useUIStore } from "@/store/uiStore";
import { useCart } from "@/hooks/useCart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";

import CartItem from "./CartItem";

export default function CartDrawer() {
  const isCartOpen = useUIStore((s) => s.isCartOpen);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const { items, totalItems, totalPrice, clearCart } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="flex items-center gap-2 text-base">
              <ShoppingBag className="h-5 w-5" />
              سلة التسوق
              {totalItems > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </SheetTitle>

            <div className="flex items-center gap-1">
              {totalItems > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:text-destructive"
                  onClick={clearCart}>
                  إفراغ السلة
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-pointer"
                onClick={() => setCartOpen(false)}
                aria-label="إغلاق السلة">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-16 text-center">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="mb-1 font-medium">السلة فارغة</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                أضف منتجات لتظهر هنا
              </p>
              <Link
                href="/shop"
                onClick={() => setCartOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex",
                )}>
                تصفح المتجر
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem key={`${item.id}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t bg-background px-4 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">الشحن</span>
              <span className="font-medium text-green-600">
                يُحسب عند الطلب
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-bold">
              <span>الإجمالي</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex",
                )}>
                عرض السلة
              </Link>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className={cn(buttonVariants(), "inline-flex")}>
                إتمام الطلب
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
