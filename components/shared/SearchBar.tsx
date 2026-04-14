"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      return;
    }

    if (pathname.startsWith("/search")) {
      router.push("/search");
    }
  }, [debouncedQuery, pathname, router]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="pointer-events-none absolute inset-e-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن منتج..."
        className="pe-9"
      />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-s-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => setQuery("")}>
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
