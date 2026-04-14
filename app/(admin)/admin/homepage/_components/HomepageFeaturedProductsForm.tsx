"use client"

import { useFormStatus } from "react-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { saveHomepageFeaturedProducts } from "@/lib/actions/product.actions"

type ProductOption = {
  id: string
  name: string
  slug: string
  category: {
    name: string
  }
}

type FeaturedEntry = {
  position: number
  productId: string
  product?: ProductOption | null
}

type HomepageFeaturedProductsFormProps = {
  products: ProductOption[]
  featuredProducts: FeaturedEntry[]
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "جاري الحفظ..." : "حفظ المنتجات الرئيسية"}
    </Button>
  )
}

export default function HomepageFeaturedProductsForm({
  products,
  featuredProducts,
}: HomepageFeaturedProductsFormProps) {
  const [message, setMessage] = useState<{
    success: boolean
    text: string
  } | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await saveHomepageFeaturedProducts(
      { success: false, message: null },
      formData,
    )
    if (result.message) {
      setMessage({
        success: result.success,
        text: result.message,
      })
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-xl border bg-background p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold">اختيار المنتجات الرئيسية</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          اختر 4 منتجات فقط لعرضها في الصفحة الرئيسية بالترتيب الذي تريده.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((slot) => {
          const current = featuredProducts.find((item) => item.position === slot)
          return (
            <div key={slot} className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor={`product-${slot}`}>
                المنتج {slot}
              </label>
              <select
                id={`product-${slot}`}
                name={`product-${slot}`}
                defaultValue={current?.productId ?? ""}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="">اختر منتجاً</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.category.name}
                  </option>
                ))}
              </select>
              {current?.product ? (
                <p className="text-xs text-muted-foreground">
                  الحالي: {current.product.name}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      {message ? (
        <p className={`text-sm ${message.success ? "text-green-600" : "text-destructive"}`}>
          {message.text}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
