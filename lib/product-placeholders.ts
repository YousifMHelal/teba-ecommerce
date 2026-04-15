
export const DEFAULT_PRODUCT_PLACEHOLDER = "/assets/product-placeholder-default.svg"

export function getProductPlaceholder(categoryName?: string) {
  if (!categoryName) return DEFAULT_PRODUCT_PLACEHOLDER

}

export function ensureProductHasImage(
  product: { images?: string[] } | null | undefined,
  categoryName?: string
) {
  if (product?.images && product.images.length > 0) {
    return product.images
  }
}
