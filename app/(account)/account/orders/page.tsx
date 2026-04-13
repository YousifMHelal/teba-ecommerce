import Link from "next/link";
import { ChevronLeft, Package } from "lucide-react";

import ProductImageWithFallback from "@/components/product/ProductImageWithFallback";
import { buttonVariants } from "@/components/ui/button";
import { getMyOrders } from "@/lib/actions/order.actions";
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

export const metadata = { title: "طلباتي" };

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default async function OrdersPage() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">لا توجد طلبات بعد</h2>
        <p className="text-muted-foreground text-sm mb-6">
          لم تقم بأي طلبات حتى الآن
        </p>
        <Link href="/shop" className={cn(buttonVariants(), "inline-flex")}>
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">طلباتي</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length} طلب
        </p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.id}`}
            className="block rounded-xl border bg-background p-4 hover:border-primary/50 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-muted-foreground">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      statusColors[order.status]
                    }`}>
                    {ORDER_STATUS[order.status]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod]} ·{" "}
                  {order.items.reduce((s, i) => s + i.quantity, 0)} منتجات
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">{formatPrice(order.total)}</p>
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex gap-1.5 mt-3">
              {order.items.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-lg bg-muted overflow-hidden border">
                  <div className="relative h-full w-full">
                    <ProductImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fallbackColorClass="bg-muted text-muted-foreground"
                      iconClassName="h-4 w-4"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
              {order.items.length > 4 && (
                <div className="h-10 w-10 rounded-lg bg-muted border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{order.items.length - 4}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
