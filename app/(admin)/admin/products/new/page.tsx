import { getCategories } from "@/lib/actions/category.actions";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "منتج جديد" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-xl font-bold">إضافة منتج جديد</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          أضف منتجاً جديداً إلى المتجر
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
