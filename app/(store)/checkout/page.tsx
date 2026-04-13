import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import CheckoutForm from "@/components/checkout/CheckoutForm"
import OrderSummary from "@/components/checkout/OrderSummary"
import { getMyAddresses } from "@/lib/actions/user.actions";

export const metadata = { title: "إتمام الطلب" };

export default async function CheckoutPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/checkout");

  const addresses = await getMyAddresses();
  const defaultAddress =
    addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm
            initialAddress={
              defaultAddress
                ? {
                    fullName: defaultAddress.fullName,
                    phone: defaultAddress.phone,
                    street: defaultAddress.street,
                    city: defaultAddress.city,
                    state: defaultAddress.state,
                    country: defaultAddress.country,
                    postalCode: defaultAddress.postalCode,
                  }
                : null
            }
          />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
