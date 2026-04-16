import { notFound } from "next/navigation"
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/actions/product.actions";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ProductGrid from "@/components/product/ProductGrid";
import ProductVariantSelector from "@/components/product/ProductVariantSelector";
import ProductImageWithFallback from "@/components/product/ProductImageWithFallback";

type PageProps = { params: Promise<{ slug: string }> };

const fallbackColors = [
  "bg-[#00BFFF]/10 text-[#00BFFF]",
  "bg-[#7B2FFF]/10 text-[#7B2FFF]",
  "bg-[#FF2D9B]/10 text-[#FF2D9B]",
  "bg-[#00CC66]/10 text-[#00CC66]",
  "bg-[#FFB800]/10 text-[#FFB800]",
] as const;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const mainImage = product.images.find((img) => img.trim().length > 0);
  const galleryImages = product.images.filter((img) => img.trim().length > 0);
  const colorKey = product.category.slug || product.category.name || "default";
  const colorHash = colorKey
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbackColor = fallbackColors[colorHash % fallbackColors.length];

  const hasDiscount =
    product.comparePrice && product.comparePrice > product.price;
  const discount = hasDiscount
    ? calculateDiscount(product.price, product.comparePrice!)
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0],
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EGP",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <ProductImageWithFallback
                src={mainImage}
                alt={product.name}
                priority
                fallbackColorClass={fallbackColor}
                iconClassName="h-12 w-12"
                className="object-cover"
              />
              {hasDiscount && (
                <Badge className="absolute top-3 inset-s-3 bg-destructive text-destructive-foreground text-sm px-2 py-1">
                  -{discount}%
                </Badge>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <ProductImageWithFallback
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      fallbackColorClass={fallbackColor}
                      iconClassName="h-7 w-7"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-2xl font-bold leading-snug">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600">
                متوفر في المخزون
              </Badge>
            ) : (
              <Badge variant="destructive">نفذ المخزون</Badge>
            )}

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {product.variants.length > 0 && (
              <ProductVariantSelector
                variants={product.variants}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: mainImage ?? "",
                  slug: product.slug,
                  stock: product.stock,
                }}
              />
            )}

            {product.variants.length === 0 && product.stock > 0 && (
              <ProductVariantSelector
                variants={[]}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: mainImage ?? "",
                  slug: product.slug,
                  stock: product.stock,
                }}
              />
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">منتجات مشابهة</h2>
            <ProductGrid products={related} />
          </div>
        )}
      </div>
    </>
  );
}
