/**
 * Product placeholder images mapping by category
 * Used as fallback when product images are not available
 */

export const PRODUCT_PLACEHOLDERS_BY_CATEGORY: Record<string, string> = {
  // Arabic category names and slugs
  "سيرفاكتانت": "/assets/product-placeholder-surfactants.svg",
  "surfactants": "/assets/product-placeholder-surfactants.svg",

  "أحماض": "/assets/product-placeholder-acids.svg",
  "acids": "/assets/product-placeholder-acids.svg",

  "عطور ومعطرات": "/assets/product-placeholder-perfumes.svg",
  "perfumes": "/assets/product-placeholder-perfumes.svg",

  "مكثفات ومساعدات": "/assets/product-placeholder-default.svg",
  "thickeners": "/assets/product-placeholder-default.svg",

  "مبيضات": "/assets/product-placeholder-default.svg",
  "bleaching-agents": "/assets/product-placeholder-default.svg",

  "عبوات وتغليف": "/assets/product-placeholder-packaging.svg",
  "packaging": "/assets/product-placeholder-packaging.svg",

  "إنزيمات": "/assets/product-placeholder-default.svg",
  "enzymes": "/assets/product-placeholder-default.svg",

  "مطهرات": "/assets/product-placeholder-default.svg",
  "disinfectants": "/assets/product-placeholder-default.svg",

  "مذيبات": "/assets/product-placeholder-default.svg",
  "solvents": "/assets/product-placeholder-default.svg",

  "ملونات": "/assets/product-placeholder-default.svg",
  "colorants": "/assets/product-placeholder-default.svg",
}

export const DEFAULT_PRODUCT_PLACEHOLDER = "/assets/product-placeholder-default.svg"

/**
 * Get the placeholder image URL for a product category
 * @param categoryName - The category name (Arabic or English slug)
 * @returns The placeholder image URL
 */
export function getProductPlaceholder(categoryName?: string): string {
  if (!categoryName) return DEFAULT_PRODUCT_PLACEHOLDER
  return PRODUCT_PLACEHOLDERS_BY_CATEGORY[categoryName] ?? DEFAULT_PRODUCT_PLACEHOLDER
}

/**
 * Ensure product has at least a placeholder image URL
 * @param product - Product object with optional images array
 * @param categoryName - Category name for placeholder selection
 * @returns Array with at least one image URL (placeholder if needed)
 */
export function ensureProductHasImage(
  product: { images?: string[] } | null | undefined,
  categoryName?: string
): string[] {
  if (product?.images && product.images.length > 0) {
    return product.images
  }
  return [getProductPlaceholder(categoryName)]
}
