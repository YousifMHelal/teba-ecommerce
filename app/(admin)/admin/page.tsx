import Image from "next/image";

import { Clock, ShoppingBag, TrendingUp, Users } from "lucide-react";

import {
  getDashboardStats,
  getPaymentMethodStats,
  getRecentOrders,
  getSalesChartData,
  getTopProducts,
} from "@/lib/actions/analytics.actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { SalesChart } from "@/components/admin/SalesChart";
import { StatsCard } from "@/components/admin/StatsCard";

export const metadata = { title: "لوحة التحكم" };

export default async function AdminDashboardPage() {
  const [stats, chartData, topProducts, recentOrders, paymentStats] =
    await Promise.all([
      getDashboardStats(),
      getSalesChartData(),
      getTopProducts(),
      getRecentOrders(),
      getPaymentMethodStats(),
    ]);

  const totalPaymentCount = paymentStats.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-bold">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          نظرة عامة على أداء المتجر
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          title="إجمالي الإيرادات"
          value={formatPrice(stats.totalRevenue)}
          subtitle={`${formatPrice(stats.revenueThisMonth)} هذا الشهر`}
          icon={TrendingUp}
          trend="up"
          color="blue"
        />
        <StatsCard
          title="إجمالي الطلبات"
          value={stats.totalOrders.toLocaleString("ar-EG")}
          subtitle={`${stats.ordersThisMonth} هذا الشهر`}
          icon={ShoppingBag}
          trend="up"
          color="green"
        />
        <StatsCard
          title="المستخدمون"
          value={stats.totalUsers.toLocaleString("ar-EG")}
          subtitle={`${stats.newUsersThisMonth} جديد هذا الشهر`}
          icon={Users}
          trend="up"
          color="purple"
        />
        <StatsCard
          title="طلبات معلقة"
          value={stats.pendingOrders.toLocaleString("ar-EG")}
          subtitle="تحتاج إلى مراجعة"
          icon={Clock}
          trend={stats.pendingOrders > 10 ? "down" : "neutral"}
          color="amber"
        />
      </div>

      <SalesChart data={chartData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-bold">طرق الدفع</h2>
            <div className="mt-3 space-y-2.5">
              {paymentStats.map((stat) => {
                const percent = totalPaymentCount
                  ? Math.round((stat.count / totalPaymentCount) * 100)
                  : 0;

                return (
                  <div key={stat.method} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        {
                          PAYMENT_METHOD_LABELS[
                            stat.method as keyof typeof PAYMENT_METHOD_LABELS
                          ]
                        }
                      </span>
                      <span className="font-medium">
                        {stat.count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border bg-background p-5 shadow-sm">
            <h2 className="text-sm font-bold">الأكثر مبيعاً</h2>
            <div className="mt-3 space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-4 shrink-0 text-xs font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.totalSold} مبيع
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-bold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              ))}

              {topProducts.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">
                  لا توجد بيانات بعد
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
