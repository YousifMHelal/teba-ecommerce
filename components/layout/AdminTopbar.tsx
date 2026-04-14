import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";

type AdminTopbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

function getInitials(name?: string | null, email?: string | null) {
  const source = (name ?? email ?? "").trim();

  if (!source) {
    return "A";
  }

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-16">
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-background px-2.5 py-1.5">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Admin"}
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {getInitials(user.name, user.email)}
            </span>
          )}
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold">{user.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

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
      </div>
    </header>
  );
}
