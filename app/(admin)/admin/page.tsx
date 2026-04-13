import { RecentOrders } from "@/components/admin/RecentOrders"
import { SalesChart } from "@/components/admin/SalesChart"
import { StatsCard } from "@/components/admin/StatsCard"

export default function AdminDashboardPage() {
  return (
    <main className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard label="Revenue" value="$128,420" delta="+12% vs last month" />
        <StatsCard label="Orders" value="1,240" delta="+8% vs last month" />
        <StatsCard label="Conversion" value="3.8%" delta="+0.6% vs last month" />
        <StatsCard label="AOV" value="$104" delta="+4% vs last month" />
      </div>
      <SalesChart />
      <RecentOrders />
    </main>
  )
}
