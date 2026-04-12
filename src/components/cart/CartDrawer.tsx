"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { CartItem } from "./CartItem"
import { CartSummary } from "./CartSummary"

type CartDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>Review items before checkout.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-3">
          <CartItem name="Everyday Overshirt" price={128} quantity={1} />
          <CartSummary subtotal={128} />
          <Button className="w-full">Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
