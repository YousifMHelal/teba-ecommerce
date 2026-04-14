"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPrice } from "@/lib/utils";

type DataPoint = {
  month: string;
  revenue: number;
  orders: number;
};

export function SalesChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold">المبيعات - آخر 7 أشهر</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={64}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => formatPrice(Number(value))}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const seriesName = String(name);
              const numericValue =
                typeof value === "number" ? value : Number(value ?? 0);

              return [
                seriesName === "revenue"
                  ? formatPrice(numericValue)
                  : numericValue,
                seriesName === "revenue" ? "الإيرادات" : "الطلبات",
              ];
            }}
          />
          <Legend
            formatter={(value) =>
              value === "revenue" ? "الإيرادات" : "الطلبات"
            }
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#revenue)"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#orders)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
