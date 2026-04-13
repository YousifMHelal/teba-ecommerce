"use client";

import { useState } from "react";
import Image from "next/image";
import { FlaskConical } from "lucide-react";

type ProductImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  fallbackColorClass: string;
  iconClassName?: string;
  className?: string;
  priority?: boolean;
};

export default function ProductImageWithFallback({
  src,
  alt,
  fallbackColorClass,
  iconClassName = "h-10 w-10",
  className = "",
  priority = false,
}: ProductImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const safeSrc = typeof src === "string" ? src.trim() : "";
  const showImage = safeSrc.length > 0 && !failed;

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

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${fallbackColorClass}`}>
      <FlaskConical className={iconClassName} />
    </div>
  );
}
