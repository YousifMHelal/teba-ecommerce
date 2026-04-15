import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import {
  PAYMENT_METHOD_LABELS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  STATUS_COLORS,
} from "@/lib/constants";
import { getAllOrders } from "@/lib/actions/order.actions";
import { formatPrice } from "@/lib/utils";

import OrderFilters from "./_components/OrderFilters";

export const metadata = { title: "الطلبات" };


const paymentColors: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
  };
}) {
  const search = searchParams?.search ?? "";
  const status = searchParams?.status ?? "";
  const paymentStatus = searchParams?.paymentStatus ?? "";
  const paymentMethod = searchParams?.paymentMethod ?? "";

  const { orders, total } = await getAllOrders(1, {
    search,
    status: status || undefined,
    paymentStatus: paymentStatus || undefined,
    paymentMethod: paymentMethod || undefined,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-bold">الطلبات</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{total} طلب</p>
        </div>
        <OrderFilters
          initialSearch={search}
          initialStatus={status}
          initialPaymentStatus={paymentStatus}
          initialPaymentMethod={paymentMethod}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                رقم الطلب
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground md:table-cell">
                العميل
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                الحالة
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground sm:table-cell">
                الدفع
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground lg:table-cell">
                الطريقة
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                الإجمالي
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground md:table-cell">
                التاريخ
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">
                  #{order.id.slice(-8).toUpperCase()}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <p className="font-medium">
                    {order.user.name ?? order.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.user.email}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS[order.status as keyof typeof ORDER_STATUS]}
                  </span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                    {
                      PAYMENT_STATUS[
                        order.paymentStatus as keyof typeof PAYMENT_STATUS
                      ]
                    }
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                  {
                    PAYMENT_METHOD_LABELS[
                      order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                    ]
                  }
                </td>
                <td className="px-4 py-3 font-bold">
                  {formatPrice(order.total)}
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد طلبات بعد
          </div>
        ) : null}
      </div>
    </div>
  );
}
