"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";

const productSchema = z.object({
  name: z.string().min(1, "اسم المنتج مطلوب"),
  price: z.string().min(1, "السعر مطلوب").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "السعر يجب أن يكون أكبر من 0"),
  comparePrice: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), "السعر يجب أن يكون رقماً موجباً"),
  stock: z.string().min(1, "المخزون مطلوب").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "المخزون يجب أن يكون رقماً موجباً"),
  categoryId: z.string().min(1, "الفئة مطلوبة"),
  description: z.string().catch(""),
  isActive: z.boolean().catch(true),
});

type ProductFormData = z.infer<typeof productSchema>;

type Props = {
  categories: Category[];
  product?: Product;
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(product);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "0",
      comparePrice: product?.comparePrice?.toString() ?? undefined,
      stock: product?.stock?.toString() ?? "0",
      categoryId: product?.categoryId ?? "",
      isActive: product?.isActive ?? true,
    },
  });

  const isActive = watch("isActive");

  const onSubmit = async (data: ProductFormData) => {
    // Filter out any undefined or empty images
    const validImages = images.filter((img) => img && typeof img === "string");

    setIsLoading(true);
    setError("");

    try {
      if (isEditing && product) {
        await updateProduct(product.id, {
          ...data,
          price: Number(data.price),
          comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
          stock: Number(data.stock),
          images: validImages,
        });
      } else {
        await createProduct({
          ...data,
          price: Number(data.price),
          comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
          stock: Number(data.stock),
          images: validImages,
        });
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Product save error:", error);
      setError(
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ المنتج",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="rounded-xl border bg-background p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">صور المنتج</h2>
          <span className="text-xs text-muted-foreground">(اختياري)</span>
        </div>
        <ImageUploader
          images={images}
          onChange={setImages}
          onUploadStateChange={setIsUploading}
          max={6}
        />
      </div>

      <div className="rounded-xl border bg-background p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold">المعلومات الأساسية</h2>

        <div className="space-y-1.5">
          <Label htmlFor="name">اسم المنتج</Label>
          <Input id="name" {...register("name")} />
          {errors.name ? (
            <p className="text-xs text-destructive">{typeof errors.name?.message === 'string' ? errors.name.message : 'خطأ'}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">
            الوصف{" "}
            <span className="text-xs text-muted-foreground">(اختياري)</span>
          </Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description ? (
            <p className="text-xs text-destructive">
              {typeof errors.description?.message === 'string' ? errors.description.message : 'خطأ'}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="categoryId">الفئة</Label>
          <select
            id="categoryId"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("categoryId")}>
            <option value="">اختر الفئة</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId ? (
            <p className="text-xs text-destructive">
              {typeof errors.categoryId?.message === 'string' ? errors.categoryId.message : 'خطأ'}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border bg-background p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold">التسعير والمخزون</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="price">السعر (ج.م)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              dir="ltr"
              {...register("price")}
            />
            {errors.price ? (
              <p className="text-xs text-destructive">{typeof errors.price?.message === 'string' ? errors.price.message : 'خطأ'}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="comparePrice">
              السعر قبل الخصم{" "}
              <span className="text-xs text-muted-foreground">(اختياري)</span>
            </Label>
            <Input
              id="comparePrice"
              type="number"
              step="0.01"
              dir="ltr"
              {...register("comparePrice")}
            />
            {errors.comparePrice ? (
              <p className="text-xs text-destructive">
                {typeof errors.comparePrice?.message === 'string' ? errors.comparePrice.message : 'خطأ'}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stock">المخزون</Label>
            <Input id="stock" type="number" dir="ltr" {...register("stock")} />
            {errors.stock ? (
              <p className="text-xs text-destructive">{typeof errors.stock?.message === 'string' ? errors.stock.message : 'خطأ'}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">نشر المنتج</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isActive ? "المنتج ظاهر في المتجر" : "المنتج مخفي عن العملاء"}
            </p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={isActive}
              onChange={(event) =>
                setValue("isActive", event.target.checked, {
                  shouldDirty: true,
                })
              }
            />
            <span className="h-6 w-11 rounded-full bg-muted transition peer-checked:bg-primary" />
            <span className="absolute inset-s-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition peer-checked:inset-s-auto peer-checked:inset-e-0.5" />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1">
          إلغاء
        </Button>
        <Button
          type="submit"
          disabled={isLoading || isUploading}
          className="flex-1">
          {isLoading
            ? "جاري الحفظ..."
            : isUploading
              ? "جاري رفع الصور..."
              : isEditing
                ? "تحديث المنتج"
                : "إضافة المنتج"}
        </Button>
      </div>
    </form>
  );
}
