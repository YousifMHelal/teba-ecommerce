import { sampleProducts } from "@/lib/constants"

export function OrderSummary() {
  return (
    <aside className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <h2 className="text-xl font-semibold text-zinc-950">Order summary</h2>
      <div className="space-y-3">
        {sampleProducts.slice(0, 2).map((product) => (
          <div key={product.id} className="flex items-center justify-between text-sm text-zinc-600">
            <span>{product.name}</span>
            <span>${product.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-semibold text-zinc-950">
        <span>Total</span>
        <span>$182.00</span>
      </div>
    </aside>
  )
}
