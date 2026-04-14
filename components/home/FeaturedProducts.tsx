import Link from "next/link";

import ProductCard from "@/components/product/ProductCard";
import { getHomepageFeaturedProducts } from "@/lib/actions/product.actions";
import type { ProductCardType } from "@/types";

type ProductItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock?: number;
  category?: {
    name: string;
    slug: string;
  } | null;
};

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

export default async function FeaturedProducts() {
  let products: ProductItem[] = [];
  let failedToLoad = false;

  try {
    const result = await getHomepageFeaturedProducts();
    products = result.slice(0, 4);
  } catch {
    failedToLoad = true;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">منتجات مميزة</h2>
        <Link href="/shop" className="text-sm text-[#00BFFF]">
          عرض الكل ←
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {failedToLoad
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : products.map((product) => {
              const normalized: ProductCardType = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                comparePrice: product.comparePrice ?? null,
                images: product.images ?? [],
                stock: product.stock ?? 0,
                category: {
                  name: product.category?.name ?? "عام",
                  slug: product.category?.slug ?? "general",
                },
              };

              return <ProductCard key={product.id} product={normalized} />;
            })}
      </div>
    </section>
  );
}
