import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number
  totalPages: number
}

export function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      {page <= 1 ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline" }),
            "pointer-events-none opacity-50",
          )}
        >
          Previous
        </span>
      ) : (
        <Link href={`?page=${Math.max(1, page - 1)}`} className={buttonVariants({ variant: "outline" })}>
          Previous
        </Link>
      )}
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      {page >= totalPages ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline" }),
            "pointer-events-none opacity-50",
          )}
        >
          Next
        </span>
      ) : (
        <Link href={`?page=${Math.min(totalPages, page + 1)}`} className={buttonVariants({ variant: "outline" })}>
          Next
        </Link>
      )}
    </div>
  )
}
