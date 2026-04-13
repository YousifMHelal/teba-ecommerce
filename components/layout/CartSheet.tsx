"use client";

import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";

export function CartSheet() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const setCartOpen = useUIStore((state) => state.setCartOpen);

  return (
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
  );
}
