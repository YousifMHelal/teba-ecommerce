import { notFound } from "next/navigation";

import { getCategories } from "@/lib/actions/category.actions";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

type EditProductPageProps = {
  params: {
    id: string;
  };
};

export const metadata = { title: "تعديل المنتج" };

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold">تعديل المنتج</h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
