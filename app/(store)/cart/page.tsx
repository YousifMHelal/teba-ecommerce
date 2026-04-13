import { Button } from "@/components/ui/button"

import { CartItem } from "@/components/cart/CartItem"
import { CartSummary } from "@/components/cart/CartSummary"

export default function CartPage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <div className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Cart</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950">Your items</h1>
        </div>
        <CartItem name="Everyday Overshirt" price={128} quantity={1} />
        <CartItem name="Field Canvas Bag" price={92} quantity={2} />
      </div>
      <div className="space-y-4">
        <CartSummary subtotal={312} shipping={12} tax={18} />
        <Button className="w-full" size="lg">
          Continue to checkout
        </Button>
      </div>
    </main>
  )
}
