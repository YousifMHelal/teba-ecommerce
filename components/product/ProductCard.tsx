"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount, truncate } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { ProductCardType } from "@/types";

type ProductCardProps = {
  product: ProductCardType;
};

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const;

export default function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = useMemo(
    () =>
      product.images.find(
        (img) => typeof img === "string" && img.trim().length > 0,
      ),
    [product.images],
  );
  const fallbackColor = useMemo(() => {
    const key = product.category.slug || product.category.name || "default";
    const hash = key
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackColors[hash % fallbackColors.length];
  }, [product.category.slug, product.category.name]);

  const hasDiscount =
    product.comparePrice !== null && product.comparePrice > product.price;
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.comparePrice as number)
    : 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative rounded-xl border bg-card p-3 transition-shadow hover:shadow-sm">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-muted">
        {imageSrc && !imageFailed ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${fallbackColor}`}>
            <FlaskConical className="h-8 w-8" />
          </div>
        )}
        {hasDiscount && (
          <Badge className="absolute top-2 inset-s-2 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-1">
        {product.category.name}
      </p>
      <h3 className="text-sm font-medium leading-snug line-clamp-2 min-h-10">
        {truncate(product.name, 55)}
      </h3>

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-bold text-sm">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice as number)}
            </span>
          )}
        </div>
        <AddToCartButton product={product} />
      </div>
    </Link>
  );
}

export { ProductCard };
