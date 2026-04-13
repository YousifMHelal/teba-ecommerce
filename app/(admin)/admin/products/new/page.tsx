import { ImageUploader } from "@/components/admin/ImageUploader"
import { ProductForm } from "@/components/admin/ProductForm"

export default function NewProductPage() {
  return (
    <main className="space-y-6">
      <ProductForm />
      <ImageUploader />
    </main>
  )
}
