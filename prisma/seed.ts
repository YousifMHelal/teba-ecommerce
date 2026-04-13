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
    { name: "إلكترونيات", slug: "electronics" },
    { name: "ملابس", slug: "clothing" },
    { name: "المنزل والمطبخ", slug: "home-kitchen" },
    { name: "الرياضة", slug: "sports" },
    { name: "الكتب", slug: "books" },
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
  const electronics = categories.find((c) => c.slug === "electronics")!
  const clothing = categories.find((c) => c.slug === "clothing")!

  const productsData = [
    {
      name: "سماعات لاسلكية احترافية",
      slug: "wireless-headphones-pro",
      description: "سماعات لاسلكية عالية الجودة مع خاصية إلغاء الضوضاء وبطارية تدوم 30 ساعة",
      price: 299.99,
      comparePrice: 399.99,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
      stock: 50,
      categoryId: electronics.id,
      variants: {
        create: [
          { name: "اللون", value: "أسود", stock: 30 },
          { name: "اللون", value: "أبيض", stock: 20 },
        ],
      },
    },
    {
      name: "ساعة ذكية متطورة",
      slug: "smart-watch-advanced",
      description: "ساعة ذكية مع شاشة AMOLED وتتبع صحي شامل ومقاومة للماء",
      price: 199.99,
      comparePrice: 249.99,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
      stock: 35,
      categoryId: electronics.id,
      variants: {
        create: [
          { name: "الحجم", value: "42mm", stock: 20 },
          { name: "الحجم", value: "46mm", stock: 15 },
        ],
      },
    },
    {
      name: "قميص قطني كلاسيكي",
      slug: "classic-cotton-shirt",
      description: "قميص قطني 100% بقصة كلاسيكية مريحة مثالي للاستخدام اليومي",
      price: 49.99,
      comparePrice: 69.99,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
      stock: 100,
      categoryId: clothing.id,
      variants: {
        create: [
          { name: "المقاس", value: "S", stock: 25 },
          { name: "المقاس", value: "M", stock: 35 },
          { name: "المقاس", value: "L", stock: 25 },
          { name: "المقاس", value: "XL", stock: 15 },
        ],
      },
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
