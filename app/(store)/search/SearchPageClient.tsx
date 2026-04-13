"use client"

import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
  RefinementList,
  Stats,
} from "react-instantsearch"
import { searchClient, ALGOLIA_INDEX } from "@/lib/algolia"
import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

function ProductHit({ hit }: { hit: any }) {
  return (
    <Link
      href={`/shop/${hit.slug}`}
      className="flex gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow bg-background"
    >
      <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
        {hit.image && (
          <Image src={hit.image} alt={hit.name} fill unoptimized className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{hit.categoryName}</p>
        <h3 className="font-medium text-sm leading-snug line-clamp-2">{hit.name}</h3>
        <p className="text-sm font-bold mt-1">{formatPrice(hit.price)}</p>
      </div>
    </Link>
  )
}

export default function SearchPageClient() {
  return (
    <InstantSearch searchClient={searchClient} indexName={ALGOLIA_INDEX}>
      <Configure hitsPerPage={12} />

      <SearchBox
        placeholder="ابحث عن منتج..."
        classNames={{
          root: "mb-6",
          form: "relative",
          input:
            "w-full h-11 rounded-lg border border-input bg-background px-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
          submit: "hidden",
          reset: "hidden",
        }}
      />

      <div className="flex gap-6">
        <div className="hidden md:block w-48 shrink-0">
          <p className="text-sm font-medium mb-2">الفئة</p>
          <RefinementList
            attribute="categoryName"
            classNames={{
              list: "space-y-1",
              item: "flex items-center gap-2 text-sm",
              checkbox: "rounded",
              label: "cursor-pointer",
              count: "text-muted-foreground text-xs",
            }}
          />
        </div>

        <div className="flex-1">
          <Stats
            classNames={{
              root: "text-sm text-muted-foreground mb-4",
            }}
            translations={{
              rootElementText({ nbHits, processingTimeMS }) {
                return `${nbHits} نتيجة (${processingTimeMS} مللي ثانية)`
              },
            }}
          />
          <Hits
            hitComponent={ProductHit}
            classNames={{
              root: "",
              list: "grid grid-cols-1 sm:grid-cols-2 gap-3",
              item: "",
            }}
          />
        </div>
      </div>
    </InstantSearch>
  )
}
