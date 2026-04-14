import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "amber" | "purple" | "red";
};

const colorMap = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  purple:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
} as const;

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            colorMap[color],
          )}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 space-y-0.5">
        <p className="text-2xl font-bold">{value}</p>
        {subtitle ? (
          <p
            className={cn(
              "text-xs",
              trend === "up" && "text-green-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-muted-foreground",
              !trend && "text-muted-foreground",
            )}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
