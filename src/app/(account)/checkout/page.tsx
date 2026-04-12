import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"

export default function CheckoutPage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
      <CheckoutForm />
      <OrderSummary />
    </main>
  )
}
