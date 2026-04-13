"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  ChevronDown,
  Home,
  LogOut,
  Moon,
  Settings2,
  Sun,
  LayoutDashboard,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminPinDialog } from "@/components/layout/AdminPinDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-rose-500",
];

function getInitials(name?: string | null, email?: string | null) {
  const source = (name ?? email ?? "").trim();

  if (!source) return "T";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvatarColor(seed?: string | null): string {
  if (!seed) return AVATAR_COLORS[0];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function UserMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = resolvedTheme ?? theme;
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const isInAdminDashboard = pathname.startsWith("/admin");
  const dashboardPin = process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_PIN ?? "123456";
  const avatarColor = getAvatarColor(user?.email);

  const openPinDialog = () => {
    setIsPinDialogOpen(true);
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-border/60 bg-background px-4 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted">
        تسجيل الدخول
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-2 py-1.5 text-left shadow-sm transition-colors hover:bg-muted focus-visible:outline-none">
        <Avatar size="sm" className="size-8">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ?? "User"}
          />
          <AvatarFallback className={`${avatarColor} text-white`}>
            {getInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5 py-2 text-right">
            <div className="text-sm font-medium text-foreground capitalize">
              {user.name ?? "User"}
            </div>
            <div className="text-xs font-normal text-muted-foreground capitalize">
              {user.email ?? "No email"}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {isAdmin && (
          <>
            {isInAdminDashboard ? (
              <DropdownMenuItem
                render={
                  <Link
                    href="/"
                    className="flex w-full items-center justify-start cursor-pointer gap-2 rounded-md px-1.5 py-1 text-right text-sm outline-none select-none"
                  />
                }>
                <Home className="size-4" />
                الصفحة الرئيسية
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="flex w-full items-center justify-start cursor-pointer gap-2 text-right"
                onSelect={(event) => {
                  event.preventDefault();
                  openPinDialog();
                }}
                onClick={openPinDialog}>
                <LayoutDashboard className="size-4" />
                لوحة التحكم
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem
          render={
            <Link
              href="/account/profile"
              className="flex w-full items-center justify-start cursor-pointer gap-2 rounded-md px-1.5 py-1 text-right text-sm outline-none select-none"
            />
          }>
          <Settings2 className="size-4" />
          إعدادات الحساب
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex w-full items-center justify-start cursor-pointer gap-2 text-right"
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          disabled={!mounted}>
          {currentTheme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
          تبديل المظهر
          <span className="text-xs text-muted-foreground">
            {currentTheme === "dark" ? "فاتح" : "داكن"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="flex w-full items-center justify-start cursor-pointer gap-2 text-right text-destructive"
          onClick={() => void signOut({ callbackUrl: "/" })}>
          <LogOut className="size-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AdminPinDialog
        open={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        expectedPin={dashboardPin}
        onSuccess={() => router.push("/admin")}
      />
    </DropdownMenu>
  );
}
