import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SearchBarProps = {
  placeholder?: string
}

export function SearchBar({ placeholder = "Search products, categories, brands..." }: SearchBarProps) {
  return (
    <form action="/search" className="flex w-full max-w-2xl items-center gap-2">
      <Input name="q" placeholder={placeholder} className="h-11 rounded-full bg-white/90" />
      <Link href="/search" className={buttonVariants({ size: "lg", className: "rounded-full px-6" })}>
        Search
      </Link>
    </form>
  )
}
