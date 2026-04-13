import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import OrderSummary from "@/components/checkout/OrderSummary"

export const metadata = { title: "إتمام الطلب" }

export default async function CheckoutPage() {
  const session = await auth()
  if (!session) redirect("/login?callbackUrl=/checkout")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
