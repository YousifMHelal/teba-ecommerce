"use client";

import { useMemo } from "react";
import { ShoppingCart, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function CartSheet() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const cartOpen = useUIStore((state) => state.cartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative cursor-pointer"
        onClick={() => setCartOpen(true)}
        aria-label="Open cart">
        <ShoppingCart className="size-4" />
        {cartCount > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {cartCount}
          </span>
        ) : null}
      </Button>

      <SheetContent
        side="right"
        dir="rtl"
        showCloseButton={false}
        className="w-full sm:max-w-md">
        <SheetHeader className="flex-row items-center justify-between px-4 pt-4 text-right sm:px-6">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <SheetTitle className="font-(family-name:--font-cairo) text-right">
                سلة التسوق
              </SheetTitle>
              {cartCount > 0 ? (
                <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </div>
            <SheetDescription className="text-right">
              {cartCount > 0
                ? `لديك ${cartCount} عنصر في السلة`
                : "سلة التسوق فارغة"}
            </SheetDescription>
          </div>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 cursor-pointer"
              />
            }>
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>

        {cartCount > 0 ? (
          <div className="flex flex-1 flex-col justify-center px-4 pb-4 text-right text-sm text-muted-foreground sm:px-6">
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-6 text-right">
              <div className="flex items-center justify-between gap-4">
                <span>عدد العناصر</span>
                <span className="font-semibold text-foreground">{cartCount}</span>
              </div>
              <p className="mt-2">سيتم عرض عناصر السلة هنا لاحقًا.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-6 text-center text-sm text-muted-foreground sm:px-6">
            <div className="relative flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ShoppingCart className="size-6" />
              <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-background p-0.5 text-muted-foreground">
                <XIcon className="size-3" />
              </span>
            </div>
            <p className="font-medium text-foreground">سلة التسوق فارغة</p>
            <p>أضف بعض المنتجات للبدء.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
