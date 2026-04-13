import type { ProductCardType } from "@/types";

import ProductCard from "./ProductCard";

type ProductGridProps = {
  products?: ProductCardType[];
};

export default function ProductGrid({ products = [] }: ProductGridProps) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export { ProductGrid };
