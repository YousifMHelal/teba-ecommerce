import { notFound } from "next/navigation"

import { CategoryForm } from "../../_components/CategoryForm"
import { getCategories } from "@/lib/actions/category.actions"

type PageProps = {
  params: {
    id: string
  }
}

export const metadata = { title: "تعديل الفئة" }

export default async function EditCategoryPage({ params }: PageProps) {
  const categories = await getCategories()
  const category = categories.find((item) => item.id === params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <h1 className="text-xl font-bold">تعديل الفئة</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  )
}
