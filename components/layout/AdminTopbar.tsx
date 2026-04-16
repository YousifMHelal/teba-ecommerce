import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

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
    <header className="hidden lg:block sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-16">
        <div className="flex gap-1.5 items-center">
          <Avatar>
            {user?.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name ?? user.email ?? "Admin"}
              />
            ) : null}
            <AvatarFallback>
              {user?.name?.[0] ?? user?.email?.[0] ?? "A"}
            </AvatarFallback>
          </Avatar>
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
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
