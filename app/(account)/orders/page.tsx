import Link from "next/link";
import { Package } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getMyOrders } from "@/lib/actions/order.actions";
import { cn } from "@/lib/utils";

import OrdersClient from "./_components/OrdersClient";

export const metadata = { title: "طلباتي" };

export default async function OrdersPage() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
        <h2 className="mb-2 text-lg font-bold">لا توجد طلبات بعد</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          لم تقم بأي طلبات حتى الآن
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "inline-flex")}>
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return <OrdersClient initialOrders={orders} />;
}
