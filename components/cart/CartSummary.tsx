type CartSummaryProps = {
  subtotal: number
  shipping?: number
  tax?: number
}

export function CartSummary({ subtotal, shipping = 0, tax = 0 }: CartSummaryProps) {
  const total = subtotal + shipping + tax

  return (
    <div className="space-y-3 rounded-[1.5rem] border border-black/5 bg-white/90 p-5">
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-semibold text-zinc-950">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}
