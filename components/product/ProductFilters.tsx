"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SORT_OPTIONS } from "@/lib/constants";
import { Category } from "@prisma/client";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductFilters({
  categories,
  hideCategory = false,
}: {
  categories: Category[];
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 400);

  const currentCategory = searchParams.get("category") || "all";
  const currentSort = searchParams.get("sort") || "createdAt_desc";

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParamsString, searchParams]);

  const currentCategoryLabel = useMemo(() => {
    if (currentCategory === "all") return "كل الفئات";
    return (
      categories.find((cat) => cat.slug === currentCategory)?.name ??
      "كل الفئات"
    );
  }, [categories, currentCategory]);

  const currentSortLabel = useMemo(() => {
    return (
      SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label ?? "الأحدث"
    );
  }, [currentSort]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParamsString],
  );

  const clearFilters = () => {
    setSearch("");
    router.push(pathname);
  };

  useEffect(() => {
    const currentSearchParam = searchParams.get("search") || "";
    if (debouncedSearch === currentSearchParam) return;
    updateFilter("search", debouncedSearch.trim());
  }, [debouncedSearch, searchParamsString, updateFilter, searchParams]);

  const hasFilters =
    searchParams.has("search") ||
    searchParams.has("category") ||
    searchParams.has("sort") ||
    searchParams.has("minPrice") ||
    searchParams.has("maxPrice");

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <div className="w-full sm:w-64">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="h-9"
        />
      </div>

      {!hideCategory && (
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">الفئة</Label>
          <Select
            value={currentCategory}
            onValueChange={(v) => updateFilter("category", v ?? "all")}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue>{currentCategoryLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفئات</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Label className="text-sm whitespace-nowrap">الترتيب</Label>
        <Select
          value={currentSort}
          onValueChange={(v) => updateFilter("sort", v ?? "createdAt_desc")}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue>{currentSortLabel}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9">
          مسح الفلاتر
        </Button>
      )}
    </div>
  );
}

export { ProductFilters };
