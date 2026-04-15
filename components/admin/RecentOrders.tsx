import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS, PAYMENT_METHOD_LABELS, STATUS_COLORS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  user: { name: string | null; email: string };
  items: { quantity: number }[];
};


export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="text-sm font-bold">أحدث الطلبات</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-xs">
            عرض الكل
            <ChevronLeft className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      <div className="divide-y">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs text-muted-foreground">
                  #{order.id.slice(-8).toUpperCase()}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                  {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]}
                </span>
              </div>
              <p className="mt-0.5 truncate text-sm font-medium">
                {order.user.name ?? order.user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {
                  PAYMENT_METHOD_LABELS[
                    order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                  ]
                }
                {" · "}
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} منتج
              </p>
            </div>
            <div className="shrink-0 text-end">
              <p className="text-sm font-bold">{formatPrice(order.total)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
