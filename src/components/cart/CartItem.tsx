type CartItemProps = {
  name: string
  price: number
  quantity: number
}

export function CartItem({ name, price, quantity }: CartItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4">
      <div>
        <p className="font-medium text-zinc-950">{name}</p>
        <p className="text-sm text-zinc-500">Qty {quantity}</p>
      </div>
      <p className="font-medium text-zinc-950">${(price * quantity).toFixed(2)}</p>
    </div>
  )
}
