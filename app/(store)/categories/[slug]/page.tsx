import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchX, FlaskConical } from "lucide-react";
import { getCategoryBySlug } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import ProductGrid from "@/components/product/ProductGrid";
import ProductFilters from "@/components/product/ProductFilters";
import Pagination from "@/components/shared/Pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const;

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "الفئة غير موجودة",
      description: "الفئة التي تبحث عنها غير موجودة",
    };
  }

  return {
    title: `${category.name} - طيبة`,
    description: `تصفح جميع منتجات ${category.name}`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const [category, { products, total, pages, page }] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({
      categorySlug: slug,
      sort: resolvedSearchParams.sort,
      page: resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1,
      minPrice: resolvedSearchParams.minPrice
        ? Number(resolvedSearchParams.minPrice)
        : undefined,
      maxPrice: resolvedSearchParams.maxPrice
        ? Number(resolvedSearchParams.maxPrice)
        : undefined,
      search: resolvedSearchParams.search,
    }),
  ]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-semibold">الفئة غير موجودة</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            الفئة التي تبحث عنها لا توجد أو قد تم حذفها.
          </p>
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-5 inline-flex",
            )}>
            العودة للمتجر
          </Link>
        </div>
      </div>
    );
  }

  const getFallbackColor = () => {
    const hash = category.slug
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return fallbackColors[hash % fallbackColors.length];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">الأقسام</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Category Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
        <div className="h-40 w-40 shrink-0">
          {category.image ? (
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <Image
                src={category.image}
                alt={category.name}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 160px, 160px"
              />
            </div>
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center rounded-2xl ${getFallbackColor()}`}>
              <FlaskConical className="h-16 w-16" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {category._count?.products || 0} منتج
            </span>
          </div>
          <p className="text-muted-foreground">
            تصفح جميع منتجات {category.name} المتاحة لديك
          </p>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="mt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{total} منتج متاح</p>
          </div>
          <Suspense fallback={<Skeleton className="h-10 w-72" />}>
            <ProductFilters
              key={[
                resolvedSearchParams.search ?? "",
                resolvedSearchParams.sort ?? "",
                resolvedSearchParams.minPrice ?? "",
                resolvedSearchParams.maxPrice ?? "",
              ].join("|")}
              categories={[category]}
              hideCategory
            />
          </Suspense>
        </div>

        {products.length > 0 ? (
          <>
            <ProductGrid products={products} />
            <Suspense fallback={<Skeleton className="h-10 w-48 mx-auto" />}>
              <Pagination page={page} pages={pages} />
            </Suspense>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-semibold">لا توجد منتجات</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              لا توجد منتجات في هذه الفئة حالياً. جرّب زيارة فئة أخرى.
            </p>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-5 inline-flex",
              )}>
              تصفح جميع الفئات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
