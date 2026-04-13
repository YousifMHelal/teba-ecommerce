import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { navigationLinks } from "@/lib/constants"
import { SearchBar } from "@/components/shared/SearchBar"

export function Navbar() {
  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-950">
            Teba
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-zinc-600 transition-colors hover:text-zinc-950">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/cart" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Cart
          </Link>
        </div>
        <SearchBar />
      </div>
    </header>
  )
}
