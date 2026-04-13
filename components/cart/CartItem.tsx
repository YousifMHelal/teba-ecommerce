"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { type CartItem as CartItemType } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();
  const [imageFailed, setImageFailed] = useState(false);
  const safeImage = item.image?.trim() || "";
  const showImage = safeImage.length > 0 && !imageFailed;

  return (
    <div className="flex gap-3 p-4">
      <Link
        href={`/shop/${item.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {showImage ? (
          <Image
            src={safeImage}
            alt={item.name}
            fill
            unoptimized
            className="object-cover"
            sizes="80px"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
            <ShoppingBag className="h-7 w-7" />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1 space-y-1">
        <Link
          href={`/shop/${item.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-primary">
          {item.name}
        </Link>

        {item.variantLabel && (
          <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                updateQuantity(item.id, item.quantity - 1, item.variantId)
              }>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1, item.variantId)
              }
              disabled={item.quantity >= item.stock}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">
              {formatPrice(item.price * item.quantity)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
              onClick={() => removeItem(item.id, item.variantId)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
