import { prisma } from "@/lib/prisma"

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
    where: { isActive: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}
