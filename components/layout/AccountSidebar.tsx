import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { accountLinks } from "@/lib/constants"

export function AccountSidebar() {
  return (
    <aside className="rounded-[1.5rem] border border-black/5 bg-white/90 p-4 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Account</p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-950">Profile center</h2>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={buttonVariants({ variant: "ghost", className: "justify-start rounded-xl" })}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
