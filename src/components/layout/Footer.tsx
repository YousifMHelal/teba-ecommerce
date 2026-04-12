import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Teba. Built for modern commerce.</p>
        <div className="flex gap-4">
          <Link href="/shop">Shop</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/account/profile">Account</Link>
        </div>
      </div>
    </footer>
  )
}
