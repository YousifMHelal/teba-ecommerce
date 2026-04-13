"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartSheet } from "@/components/layout/CartSheet";
import { UserMenu } from "@/components/layout/UserMenu";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "الفئات" },
  { href: "/search", label: "البحث" },
  { href: "/about", label: "من نحن" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <UserMenu />
          <CartSheet />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}>
            <Menu className="size-4" />
          </Button>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-1 font-(family-name:--font-cairo) md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

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

      <div
        className={cn(
          "border-t border-border/60 md:hidden",
          isMobileMenuOpen ? "block" : "hidden",
        )}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-right font-(family-name:--font-cairo) sm:px-6 lg:px-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-right text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-primary",
                )}>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
