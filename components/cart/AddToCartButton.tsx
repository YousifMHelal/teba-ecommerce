"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { ProductCardType } from "@/types"
import { toast } from "sonner";

export default function AddToCartButton({
  product,
}: {
  product: ProductCardType;
}) {
  const { addItem } = useCart();

  if (product.stock === 0) return null;

  return (
    <Button
      size="icon"
      variant="outline"
      className="h-8 w-8 shrink-0"
      onClick={(e) => {
        e.preventDefault();
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0] ?? "",
          slug: product.slug,
          stock: product.stock,
        });
        toast.success("تمت الإضافة إلى السلة", {
          description: product.name,
        });
      }}>
      <ShoppingCart className="h-4 w-4" />
    </Button>
  );
}
