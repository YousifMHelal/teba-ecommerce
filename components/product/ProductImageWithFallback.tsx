"use client";

import { useState } from "react";
import Image from "next/image";
import { FlaskConical } from "lucide-react";
import { getProductPlaceholder } from "@/lib/product-placeholders";

type ProductImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  fallbackColorClass: string;
  iconClassName?: string;
  className?: string;
  priority?: boolean;
  categoryName?: string;
  usePlaceholderImage?: boolean;
};

export default function ProductImageWithFallback({
  src,
  alt,
  fallbackColorClass,
  iconClassName = "h-10 w-10",
  className = "",
  priority = false,
  categoryName,
  usePlaceholderImage = false,
}: ProductImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const safeSrc = typeof src === "string" ? src.trim() : "";
  const showImage = safeSrc.length > 0 && !failed;
  const placeholderImage = usePlaceholderImage ? getProductPlaceholder(categoryName) : null;

  if (showImage) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        onError={() => setFailed(true)}
        className={className || "object-cover"}
      />
    );
  }

  if (placeholderImage) {
    return (
      <Image
        src={placeholderImage}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        className={className || "object-contain p-4"}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${fallbackColorClass}`}>
      <FlaskConical className={iconClassName} />
    </div>
  );
}
