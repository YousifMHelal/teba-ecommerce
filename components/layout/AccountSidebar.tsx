"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut, ShieldCheck } from "lucide-react";
import { signOut } from "next-auth/react";

import { AdminPinDialog } from "@/components/layout/AdminPinDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/profile", label: "الملف الشخصي", icon: User },
  { href: "/orders", label: "طلباتي", icon: Package },
  { href: "/addresses", label: "عناويني", icon: MapPin },
];

type Props = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
};

export default function AccountSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);

  const openPinDialog = () => {
    setIsPinDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-col space-y-2">
      <div className="rounded-xl border bg-background p-4 flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 capitalize">
          <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
            {user.name?.charAt(0) ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}>
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            onClick={(event) => {
              event.preventDefault();
              openPinDialog();
            }}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}>
            <ShieldCheck className="h-4 w-4 shrink-0" />
            لوحة التحكم
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <LogOut className="h-4 w-4 shrink-0" />
          تسجيل الخروج
        </button>
      </nav>

      <AdminPinDialog
        open={isPinDialogOpen}
        onOpenChange={setIsPinDialogOpen}
        onSuccess={() => router.push("/admin")}
      />
    </div>
  );
}
