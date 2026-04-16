"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { AdminNavLinks } from "./AdminNavLinks";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export function AdminMobileHeader({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex lg:hidden sticky top-0 z-40 h-14 items-center justify-between px-4 border-b bg-background">
      {/* Logo (right) */}
      <div className="flex items-center gap-2">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt={APP_NAME}
            width={108}
            height={30}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <span className="text-lg font-bold">{APP_NAME}</span>
      </div>
      {/* Center: (optional page title) */}
      <div />
      {/* Hamburger (left) */}
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <span
              aria-label="فتح القائمة"
              className="flex items-center justify-center cursor-pointer">
              <Menu className="h-6 w-6" />
            </span>
          </SheetTrigger>
          <SheetContent side="right" className="w-70 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b relative">
                {/* Close button (top left in drawer) */}
                <Avatar>
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name ?? user.email ?? "Admin"} />
                  ) : null}
                  <AvatarFallback>
                    {user?.name?.[0] ?? user?.email?.[0] ?? "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right leading-tight">
                  <p className="text-sm font-semibold">
                    {user?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <AdminNavLinks onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
