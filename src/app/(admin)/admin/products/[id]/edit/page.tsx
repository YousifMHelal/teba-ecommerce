import { ImageUploader } from "@/components/admin/ImageUploader"
import { ProductForm } from "@/components/admin/ProductForm"

type EditProductPageProps = {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <main className="space-y-6">
      <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Editing {params.id}</p>
      <ProductForm />
      <ImageUploader />
    </main>
  )
}
