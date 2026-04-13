import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number;
  pages: number;
};

export default function Pagination({ page, pages }: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      {page <= 1 ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline" }),
            "pointer-events-none opacity-50",
          )}>
          السابق
        </span>
      ) : (
        <Link
          href={`?page=${Math.max(1, page - 1)}`}
          className={buttonVariants({ variant: "outline" })}>
          السابق
        </Link>
      )}
      <p className="text-sm text-muted-foreground">
        صفحة {page} من {pages}
      </p>
      {page >= pages ? (
        <span
          className={cn(
            buttonVariants({ variant: "outline" }),
            "pointer-events-none opacity-50",
          )}>
          التالي
        </span>
      ) : (
        <Link
          href={`?page=${Math.min(pages, page + 1)}`}
          className={buttonVariants({ variant: "outline" })}>
          التالي
        </Link>
      )}
    </div>
  );
}

export { Pagination };
