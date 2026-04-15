"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Menu, Search, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartSheet } from "@/components/layout/CartSheet";
import { UserMenu } from "@/components/layout/UserMenu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActiveRoute = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8 md:hidden">
        <div className="relative flex w-full items-center">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 shrink-0 rounded-full border border-border/60 bg-background"
                  aria-label="فتح القائمة"
                />
              }>
              <Menu className="size-4" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm px-0"
              showCloseButton>
              <SheetHeader className="border-b border-border/60 px-5 pb-4 pt-5">
                <div className="flex items-center justify-between gap-3 mt-5">
                  <SheetTitle className="text-right text-lg font-bold">
                    القائمة
                  </SheetTitle>
                  <Link href="/" className="shrink-0">
                    <Image
                      src="/assets/logo.png"
                      alt="Teba"
                      width={108}
                      height={30}
                      className="h-7 w-auto"
                    />
                  </Link>
                </div>
                <p className="text-right text-sm text-muted-foreground">
                  تنقل بسرعة بين الأقسام الأساسية في المتجر.
                </p>
              </SheetHeader>

              <div className="space-y-6 px-3 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/shop"
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <span>المتجر</span>
                    <ShoppingBag className="size-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-muted">
                    <span>البحث</span>
                    <Search className="size-4 text-muted-foreground" />
                  </Link>
                </div>

                <div className="space-y-2">
                  <p className="px-2 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    الروابط الأساسية
                  </p>
                  <nav className="space-y-1">
                    {NAV_LINKS.map((link) => {
                      const isActive = isActiveRoute(link.href);

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "border-primary/25 bg-primary/10 text-primary"
                              : "border-border/70 bg-card text-foreground hover:bg-muted",
                          )}>
                          <span>{link.label}</span>
                          <ChevronLeft className="size-4 text-muted-foreground" />
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
                  <p className="text-sm font-medium">حسابك</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    استخدم القائمة العلوية للوصول إلى السلة والحساب والطلباتي.
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Teba"
              width={116}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <div className="absolute right-0 flex items-center gap-2">
            <UserMenu />
            <CartSheet />
          </div>
        </div>
      </div>

      <div className="mx-auto hidden h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8 md:flex">
        <div className="flex items-center gap-2">
          <UserMenu />
          <CartSheet />
        </div>

        <nav className="flex flex-1 items-center justify-center gap-1 font-(family-name:--font-cairo)">
          {NAV_LINKS.map((link) => {
            const isActive = isActiveRoute(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground",
                )}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className="shrink-0">
          <Image
            src="/assets/logo.png"
            alt="Teba"
            width={116}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
