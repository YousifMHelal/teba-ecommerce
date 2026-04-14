"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Filter, Package, Search, X } from "lucide-react";

import ProductImageWithFallback from "@/components/product/ProductImageWithFallback";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  total: number;
  status: keyof typeof ORDER_STATUS;
  paymentMethod: keyof typeof PAYMENT_METHOD_LABELS;
  createdAt: string | Date;
  items: {
    quantity: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
};

type OrdersClientProps = {
  initialOrders: Order[];
};

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

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [paymentMethod, setPaymentMethod] = useState("ALL");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return initialOrders.filter((order) => {
      const orderText = [
        order.id,
        order.id.slice(-8),
        ORDER_STATUS[order.status],
        PAYMENT_METHOD_LABELS[order.paymentMethod],
        new Date(order.createdAt).toLocaleDateString("ar-EG"),
        ...order.items.map((item) => item.product.name),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || orderText.includes(query);
      const matchesStatus = status === "ALL" || order.status === status;
      const matchesPaymentMethod =
        paymentMethod === "ALL" || order.paymentMethod === paymentMethod;

      return matchesSearch && matchesStatus && matchesPaymentMethod;
    });
  }, [initialOrders, paymentMethod, search, status]);

  const clearFilters = () => {
    setSearch("");
    setStatus("ALL");
    setPaymentMethod("ALL");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">طلباتي</h1>
        <p className="text-muted-foreground text-sm">
          {filteredOrders.length} من أصل {initialOrders.length} طلب
        </p>
      </div>

      <div className="rounded-xl border bg-background p-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_repeat(2,minmax(0,1fr))_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث برقم الطلب أو اسم المنتج..."
              className="h-10 ps-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="مسح البحث">
                <X className="size-4" />
              </button>
            )}
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="ALL">كل الحالات</option>
            {Object.entries(ORDER_STATUS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="ALL">كل طرق الدفع</option>
            {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <Button type="button" variant="outline" className="h-10 gap-2" onClick={clearFilters}>
            <Filter className="size-4" />
            تصفية
          </Button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-22rem)] space-y-3 overflow-y-auto pr-1 lg:max-h-[calc(100vh-24rem)]">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-background px-6 py-10 text-center">
            <Package className="mx-auto mb-3 size-12 text-muted-foreground/30" />
            <p className="text-sm font-medium">لا توجد طلبات مطابقة</p>
            <p className="mt-1 text-sm text-muted-foreground">
              جرّب تغيير البحث أو الفلاتر الحالية
            </p>
            <Button type="button" variant="ghost" className="mt-4" onClick={clearFilters}>
              إعادة ضبط الفلاتر
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-xs text-muted-foreground">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statusColors[order.status],
                      )}>
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
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} منتجات
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                  <ChevronLeft className="size-4 text-muted-foreground" />
                </div>
              </div>

              <div className="mt-3 flex gap-1.5">
                {order.items.slice(0, 4).map((item, index) => (
                  <div
                    key={index}
                    className="h-10 w-10 overflow-hidden rounded-lg border bg-muted">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                    <span className="text-xs text-muted-foreground">
                      +{order.items.length - 4}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
