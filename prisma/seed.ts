import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import slugify from "slugify"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123456", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@teba.com" },
    update: {},
    create: {
      name: "مدير طيبة",
      email: "admin@teba.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })
  console.log("✅ Admin user created:", admin.email)

  // Test user
  const userPassword = await bcrypt.hash("user123456", 12)
  const user = await prisma.user.upsert({
    where: { email: "user@teba.com" },
    update: {},
    create: {
      name: "أحمد محمد",
      email: "user@teba.com",
      password: userPassword,
      role: Role.USER,
    },
  })
  console.log("✅ Test user created:", user.email)

  // Categories
  const categoryData = [
    { name: "سيرفاكتانت", slug: "surfactants" },
    { name: "أحماض", slug: "acids" },
    { name: "عطور ومعطرات", slug: "perfumes" },
    { name: "مكثفات ومساعدات", slug: "thickeners" },
    { name: "مبيضات", slug: "bleaching-agents" },
    { name: "عبوات وتغليف", slug: "packaging" },
  ]

  const categories = await Promise.all(
    categoryData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug ?? slugify(cat.name, { lower: true, strict: true }) },
        update: {},
        create: {
          ...cat,
          slug: cat.slug ?? slugify(cat.name, { lower: true, strict: true }),
        },
      })
    )
  )
  console.log(`✅ ${categories.length} categories created`)

  // Products
  const surfactants = categories.find((c) => c.slug === "surfactants")!
  const acids = categories.find((c) => c.slug === "acids")!

  const productsData = [
    {
      name: "سيرفاكتانت عالي الجودة",
      slug: "premium-surfactant",
      description: "سيرفاكتانت عالي الجودة مناسب لصناعة المنظفات - نقاء 98%",
      price: 45.99,
      comparePrice: 59.99,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=800"],
      stock: 150,
      categoryId: surfactants.id,
    },
    {
      name: "حمض الخليك الصناعي",
      slug: "acetic-acid-industrial",
      description: "حمض الخليك الصناعي بتركيز 99% - آمن وفعال للتنظيف",
      price: 22.50,
      comparePrice: 29.99,
      images: ["https://images.unsplash.com/photo-1576937364205-d309bda59c5f?w=800"],
      stock: 200,
      categoryId: acids.id,
    },
    {
      name: "عطر زهري مركز",
      slug: "floral-fragrance-concentrated",
      description: "عطر زهري مركز عالي الجودة للمنظفات - رائحة دائمة",
      price: 35.00,
      comparePrice: 49.99,
      images: ["https://images.unsplash.com/photo-1583394838888-aaf4fb8a0fe8?w=800"],
      stock: 80,
      categoryId: categories.find((c) => c.slug === "perfumes")!.id,
    },
  ]

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug ?? slugify(product.name, { lower: true, strict: true }) },
      update: {},
      create: {
        ...product,
        slug: product.slug ?? slugify(product.name, { lower: true, strict: true }),
      },
    })
  }
  console.log(`✅ ${productsData.length} products created`)

  console.log("✅ Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
