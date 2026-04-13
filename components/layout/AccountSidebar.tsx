import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { accountLinks } from "@/lib/constants"

export function AccountSidebar() {
  return (
    <aside className="rounded-xl border bg-background shadow-sm p-5 space-y-4">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          حسابك
        </p>
        <h2 className="mt-2 text-lg font-bold">مركز الحساب</h2>
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        {accountLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={buttonVariants({
              variant: "ghost",
              className: "justify-start rounded-lg h-9 px-3 text-sm",
            })}>
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
