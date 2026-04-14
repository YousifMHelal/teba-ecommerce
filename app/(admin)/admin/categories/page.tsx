import Image from "next/image";
import Link from "next/link";

import { Pencil, Plus } from "lucide-react";

import { getCategories } from "@/lib/actions/category.actions";

import DeleteCategoryButton from "./_components/DeleteCategoryButton";
import CategoryFilters from "./_components/CategoryFilters";

export const metadata = { title: "الفئات" };

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const search = searchParams?.search ?? "";
  const categories = await getCategories(search);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-xl font-bold">الفئات</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {categories.length} فئة
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <CategoryFilters initialSearch={search} />
          <Link
            href="/admin/categories/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            فئة جديدة
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                الفئة
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                الرابط
              </th>
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                المنتجات
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                    ) : null}
                    <p className="font-medium">{category.name}</p>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {category.slug}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {category._count.products} منتج
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <DeleteCategoryButton id={category.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            لا توجد فئات مطابقة
          </div>
        ) : null}
      </div>
    </div>
  );
}
