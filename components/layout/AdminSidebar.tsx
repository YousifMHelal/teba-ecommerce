"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Users,
} from "lucide-react";

import { ADMIN_NAV_LINKS, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden lg:flex h-screen w-64 shrink-0 flex-col border-e bg-background overflow-y-auto">
      <div className="flex h-16 items-center border-b px-5 shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-bold">{APP_NAME} - Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV_LINKS.map((item) => {
          const { href, label, icon: Icon } = item;
          const exact = "exact" in item ? item.exact : false;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive(href, exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}>
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Store className="h-4 w-4 shrink-0" />
          عرض المتجر
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4 shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
