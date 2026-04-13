"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useUIStore } from "@/store/uiStore";
import { ProductVariant } from "@prisma/client";
import { formatPrice } from "@/lib/utils";

type Props = {
  variants: ProductVariant[];
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    stock: number;
  };
};

export default function ProductVariantSelector({ variants, product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null,
  );
  const { addItem } = useCart();
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const finalPrice = selectedVariant
    ? product.price + selectedVariant.priceAdjustment
    : product.price;

  const finalStock = selectedVariant ? selectedVariant.stock : product.stock;

  const variantGroups = variants.reduce<Record<string, ProductVariant[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      acc[v.name].push(v);
      return acc;
    },
    {},
  );

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      slug: product.slug,
      stock: finalStock,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant
        ? `${selectedVariant.name}: ${selectedVariant.value}`
        : undefined,
    });
    setCartOpen(true);
  };

  return (
    <div className="space-y-4">
      {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
        <div key={groupName}>
          <p className="text-sm font-medium mb-2">{groupName}</p>
          <div className="flex flex-wrap gap-2">
            {groupVariants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary"
                } disabled:opacity-40 disabled:cursor-not-allowed`}>
                {v.value}
                {v.priceAdjustment > 0 && (
                  <span className="text-xs mr-1">
                    (+{formatPrice(v.priceAdjustment)})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={finalStock === 0}>
        {finalStock === 0 ? "نفذ المخزون" : "أضف إلى السلة"}
      </Button>
    </div>
  );
}
