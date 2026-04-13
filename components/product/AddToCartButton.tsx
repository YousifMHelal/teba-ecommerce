"use client"

import * as React from "react"
import { toast } from "sonner"

import { useCartStore } from "@/store/cartStore"

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    price: number
    images: string[]
  }
  className?: string
  children: React.ReactNode
}

export default function AddToCartButton({
  product,
  className,
  children,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem)

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0],
        })
        toast.success("تمت الإضافة للسلة")
      }}>
      {children}
    </button>
  )
}
