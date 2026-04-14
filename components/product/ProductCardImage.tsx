"use client"

import Image from "next/image"
import { FlaskConical } from "lucide-react"
import * as React from "react"
import { getProductPlaceholder } from "@/lib/product-placeholders"

type ProductCardImageProps = {
  src?: string
  alt: string
  colorClass: string
  categoryName?: string
  fallbackToPlaceholder?: boolean
}

export default function ProductCardImage({
  src,
  alt,
  colorClass,
  categoryName,
  fallbackToPlaceholder = false,
}: ProductCardImageProps) {
  const [hasError, setHasError] = React.useState(false)
  const hasImage = Boolean(src) && !hasError
  const placeholderImage = fallbackToPlaceholder ? getProductPlaceholder(categoryName) : null

  return (
    <div className="relative aspect-square bg-muted">
      {hasImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          unoptimized
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : placeholderImage ? (
        <Image
          src={placeholderImage}
          alt={alt}
          fill
          unoptimized
          className="object-contain p-4"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-14 w-14 overflow-hidden rounded-xl">
            <div
              className={`flex h-full w-full items-center justify-center ${colorClass}`}>
              <FlaskConical className="h-6 w-6" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
