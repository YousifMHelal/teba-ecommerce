import { CategoryForm } from "./_components/CategoryForm";

export const metadata = { title: "فئة جديدة" };

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <h1 className="text-xl font-bold">إضافة فئة جديدة</h1>
      </div>
      <CategoryForm />
    </div>
  );
}
