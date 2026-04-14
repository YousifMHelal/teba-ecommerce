"use client";

import { usePathname } from "next/navigation";

import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";

export function RootBreadcrumb() {
  const pathname = usePathname();

  if (pathname.startsWith("/account")) {
    return null;
  }

  return <AppBreadcrumb />;
}
