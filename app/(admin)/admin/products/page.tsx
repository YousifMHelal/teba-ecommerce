import Image from "next/image";
import Link from "next/link";

import { Pencil, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getCategories } from "@/lib/actions/category.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { formatPrice } from "@/lib/utils";

import DeleteProductButton from "./_components/DeleteProductButton";
import ProductFilters from "./_components/ProductFilters";

export const metadata = { title: "المنتجات" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { search?: string; category?: string };
}) {
  const search = searchParams?.search ?? "";
  const categorySlug = searchParams?.category ?? "";

  const [productsResult, categories] = await Promise.all([
    getProducts({
      page: 1,
      includeInactive: true,
      search,
      categorySlug: categorySlug || undefined,
    }),
    getCategories(),
  ]);

  const { products, total } = productsResult;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-bold">المنتجات</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{total} منتج</p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <ProductFilters
            categories={categories}
            initialSearch={search}
            initialCategory={categorySlug}
          />
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            منتج جديد
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                المنتج
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground md:table-cell">
                الفئة
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                السعر
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground sm:table-cell">
                المخزون
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground sm:table-cell">
                الحالة
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : null}
                    </div>
                    <p className="line-clamp-1 font-medium">{product.name}</p>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {product.category.name}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span
                    className={
                      product.stock === 0
                        ? "font-medium text-destructive"
                        : product.stock < 10
                          ? "font-medium text-amber-600"
                          : "text-muted-foreground"
                    }>
                    {product.stock}
                  </span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "منشور" : "مخفي"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteProductButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد منتجات مطابقة
          </div>
        ) : null}
      </div>
    </div>
  );
}
