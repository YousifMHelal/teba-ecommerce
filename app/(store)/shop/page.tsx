import { Suspense } from "react";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { getProducts } from "@/lib/actions/product.actions";
import { getCategories } from "@/lib/actions/category.actions";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Pagination from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export const metadata = {
  title: "المتجر",
  description: "تصفح جميع منتجات طيبة",
};

export default async function ShopPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ products, total, pages }, categories] = await Promise.all([
    getProducts({
      categorySlug: params.category,
      search: params.search,
      sort: params.sort,
      page,
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">المتجر</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{total} منتج</p>
        </div>
        <Suspense fallback={<Skeleton className="h-10 w-72" />}>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>

      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          <Suspense fallback={<Skeleton className="h-10 w-48 mt-8" />}>
            <Pagination page={page} pages={pages} />
          </Suspense>
        </>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold">لا توجد منتجات مطابقة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            جرّب تغيير الفئة أو الترتيب أو البحث بكلمة مختلفة.
          </p>
          <Button asChild variant="outline" className="mt-5">
            <Link href="/shop">عرض كل المنتجات</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
