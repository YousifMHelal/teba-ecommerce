import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import ProductImageWithFallback from "@/components/product/ProductImageWithFallback";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/actions/order.actions";
import {
  ORDER_STATUS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS,
  SHIPPING_COST,
  SHIPPING_THRESHOLD,
} from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

type ShippingAddress = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `طلب #${id.slice(-8).toUpperCase()}` };
}

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

const paymentStatusColors: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

const statusSteps = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.shippingAddress as ShippingAddress;
  const currentStep = statusSteps.indexOf(order.status);
  const itemsTotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/account/orders"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
          <ChevronRight className="h-4 w-4" />
          العودة إلى الطلبات
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">
              طلب #{order.id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              statusColors[order.status]
            }`}>
            {ORDER_STATUS[order.status]}
          </span>
        </div>
      </div>

      {order.status !== "CANCELLED" && (
        <div className="rounded-xl border bg-background p-5">
          <h2 className="font-semibold text-sm mb-4">حالة الطلب</h2>
          <div className="relative flex justify-between">
            <div className="absolute top-4 inset-s-0 inset-e-0 h-0.5 bg-border" />
            <div
              className="absolute top-4 inset-s-0 h-0.5 bg-primary transition-all"
              style={{
                width:
                  currentStep === 0
                    ? "0%"
                    : `${(currentStep / (statusSteps.length - 1)) * 100}%`,
              }}
            />

            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div
                  key={step}
                  className="relative flex flex-col items-center gap-2 z-10">
                  <div
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}>
                    {isCompleted && !isCurrent ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-xs text-center ${
                      isCurrent
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    }`}>
                    {ORDER_STATUS[step as keyof typeof ORDER_STATUS]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="font-semibold text-sm">المنتجات</h2>
        <div className="space-y-3 divide-y">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
              <Link
                href={`/shop/${item.product.slug}`}
                className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                <ProductImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fallbackColorClass="bg-muted text-muted-foreground"
                  iconClassName="h-5 w-5"
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="text-sm font-medium line-clamp-1 hover:text-primary transition-colors">
                  {item.product.name}
                </Link>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    {item.variant.name}: {item.variant.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  الكمية: {item.quantity}
                </p>
              </div>
              <p className="font-bold text-sm shrink-0">
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
          <div className="flex justify-between font-bold text-base">
            <span>الإجمالي</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-background p-4 space-y-2">
          <h2 className="font-semibold text-sm">معلومات الدفع</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">الطريقة</span>
              <span className="font-medium">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">الحالة</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  paymentStatusColors[order.paymentStatus]
                }`}>
                {PAYMENT_STATUS[order.paymentStatus]}
              </span>
            </div>
            {order.paymentReference && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">المرجع</span>
                <span className="font-mono text-xs">
                  {order.paymentReference}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-background p-4 space-y-2">
          <h2 className="font-semibold text-sm">عنوان التوصيل</h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="text-foreground font-medium">{address.fullName}</p>
            <p>{address.street}</p>
            <p>
              {address.city}، {address.state}
            </p>
            <p>{address.country}</p>
            <p dir="ltr">{address.phone}</p>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="rounded-xl border bg-background p-4">
          <h2 className="font-semibold text-sm mb-1">ملاحظات الطلب</h2>
          <p className="text-sm text-muted-foreground">{order.notes}</p>
        </div>
      )}

      <Link
        href="/shop"
        className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}>
        مواصلة التسوق
      </Link>
    </div>
  );
}
