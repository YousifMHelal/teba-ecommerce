import { APP_URL } from "@/lib/constants"

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/account/", "/checkout/"] },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
