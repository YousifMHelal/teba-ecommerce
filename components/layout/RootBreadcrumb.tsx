"use client";

import { usePathname } from "next/navigation";

import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

export function RootBreadcrumb() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/profile") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/addresses")
  ) {
    return null;
  }

  return <AppBreadcrumb />;
}
