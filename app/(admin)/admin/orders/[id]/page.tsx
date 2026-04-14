import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/actions/order.actions";
import { formatPrice } from "@/lib/utils";
import {
  PAYMENT_METHOD_LABELS,
  SHIPPING_COST,
  SHIPPING_THRESHOLD,
} from "@/lib/constants";
import type { ShippingAddress } from "@/types/order";

import { OrderStatusForm } from "./_components/OrderStatusForm";

type AdminOrderDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const order = await getOrderById(params.id);

  if (!order) {
    notFound();
  }

  const address = order.shippingAddress as ShippingAddress;
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="mb-3 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ChevronRight className="h-4 w-4" />
          العودة إلى الطلبات
        </Link>
        <div>
          <h1 className="text-xl font-bold">
            طلب #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-bold">المنتجات</h2>
            <div className="space-y-3 divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.images[0] || "/assets/placeholder.png"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.product.name}
                    </p>
                    {item.variant ? (
                      <p className="text-xs text-muted-foreground">
                        {item.variant.name}: {item.variant.value}
                      </p>
                    ) : null}
                    <p className="text-xs text-muted-foreground">
                      الكمية: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>الشحن</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">مجاناً</span>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
                )}
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>الإجمالي</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border bg-background p-4 shadow-sm">
              <h2 className="text-sm font-bold">بيانات العميل</h2>
              <div className="space-y-0.5 text-sm">
                <p className="font-medium">{order.user.name ?? ""}</p>
                <p className="text-muted-foreground">{order.user.email}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/users">عرض الملف</Link>
              </Button>
            </div>

            <div className="space-y-2 rounded-xl border bg-background p-4 shadow-sm">
              <h2 className="text-sm font-bold">عنوان التوصيل</h2>
              <div className="space-y-0.5 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {address.fullName}
                </p>
                <p>{address.street}</p>
                <p>
                  {address.city}، {address.state}
                </p>
                <p dir="ltr">{address.phone}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-background p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-bold">طريقة الدفع</h2>
            <p className="text-sm text-muted-foreground">
              {
                PAYMENT_METHOD_LABELS[
                  order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
                ]
              }
            </p>
          </div>

          {order.paymentReference ? (
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <h2 className="mb-2 text-sm font-bold">مرجع الدفع</h2>
              <p className="inline-block rounded-lg bg-muted px-3 py-2 font-mono text-sm">
                {order.paymentReference}
              </p>
            </div>
          ) : null}

          {order.notes ? (
            <div className="rounded-xl border bg-background p-4 shadow-sm">
              <h2 className="mb-1 text-sm font-bold">ملاحظات الطلب</h2>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <OrderStatusForm order={order} />
        </div>
      </div>
    </div>
  );
}
