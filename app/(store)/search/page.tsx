import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = { title: "البحث" };

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">البحث</h1>
      <Suspense>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}
