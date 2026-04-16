import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, Store } from "lucide-react";
import { signOut } from "next-auth/react";

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1 p-4">
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
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={() => onNavigate?.()}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
      <div className="mt-4 border-t pt-4 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => onNavigate?.()}
        >
          <Store className="h-4 w-4 shrink-0" />
          عرض المتجر
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut({ callbackUrl: "/" });
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
}
