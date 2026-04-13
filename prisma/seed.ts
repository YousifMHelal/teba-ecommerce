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
    { name: "إنزيمات", slug: "enzymes" },
    { name: "مطهرات", slug: "disinfectants" },
    { name: "مذيبات", slug: "solvents" },
    { name: "ملونات", slug: "colorants" },
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
  const categoryBySlug = Object.fromEntries(categories.map((category) => [category.slug, category]))

  const productsData = [
    {
      name: "سيرفاكتانت عالي الجودة",
      slug: "premium-surfactant",
      description: "سيرفاكتانت عالي الجودة مناسب لصناعة المنظفات - نقاء 98%",
      price: 45.99,
      comparePrice: 59.99,
      images: ["https://images.unsplash.com/photo-1584308666744-24d5f400f6f0?w=800"],
      stock: 150,
      categoryId: categoryBySlug.surfactants.id,
    },
    {
      name: "حمض الخليك الصناعي",
      slug: "acetic-acid-industrial",
      description: "حمض الخليك الصناعي بتركيز 99% - آمن وفعال للتنظيف",
      price: 22.50,
      comparePrice: 29.99,
      images: ["https://images.unsplash.com/photo-1576937364205-d309bda59c5f?w=800"],
      stock: 200,
      categoryId: categoryBySlug.acids.id,
    },
    {
      name: "عطر زهري مركز",
      slug: "floral-fragrance-concentrated",
      description: "عطر زهري مركز عالي الجودة للمنظفات - رائحة دائمة",
      price: 35.00,
      comparePrice: 49.99,
      images: ["https://images.unsplash.com/photo-1583394838888-aaf4fb8a0fe8?w=800"],
      stock: 80,
      categoryId: categoryBySlug.perfumes.id,
    },
    {
      name: "مكثف جل متعدد الاستخدام",
      slug: "multi-purpose-gel-thickener",
      description: "مكثف فعال لرفع لزوجة المنظفات السائلة بسهولة وثبات عالي.",
      price: 28.00,
      comparePrice: 34.00,
      images: ["https://images.unsplash.com/photo-1544717305-2782549b5136?w=800"],
      stock: 120,
      categoryId: categoryBySlug.thickeners.id,
    },
    {
      name: "مبيض أوكسجين آمن",
      slug: "oxygen-safe-bleach",
      description: "مبيض أوكسجين لطيف على الأقمشة وفعّال في إزالة البقع الصعبة.",
      price: 31.50,
      comparePrice: 39.50,
      images: ["https://images.unsplash.com/photo-1626808642875-0aa545482dfb?w=800"],
      stock: 95,
      categoryId: categoryBySlug["bleaching-agents"].id,
    },
    {
      name: "عبوة PET سعة 1 لتر",
      slug: "pet-bottle-1l",
      description: "عبوة PET شفافة سعة 1 لتر مناسبة لمنتجات التنظيف السائلة.",
      price: 6.75,
      comparePrice: 8.00,
      images: ["https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800"],
      stock: 500,
      categoryId: categoryBySlug.packaging.id,
    },
    {
      name: "إنزيم إزالة البقع",
      slug: "stain-removal-enzyme",
      description: "إنزيم عالي التركيز لتحسين أداء المنظفات ضد البقع العضوية.",
      price: 52.00,
      comparePrice: 63.00,
      images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"],
      stock: 60,
      categoryId: categoryBySlug.enzymes.id,
    },
    {
      name: "مطهر مركز للأسطح",
      slug: "surface-disinfectant-concentrate",
      description: "تركيبة مطهرة مركزة للأسطح مع فعالية واسعة وسريعة.",
      price: 41.00,
      comparePrice: 49.00,
      images: ["https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800"],
      stock: 110,
      categoryId: categoryBySlug.disinfectants.id,
    },
    {
      name: "مذيب دهون صناعي",
      slug: "industrial-degreasing-solvent",
      description: "مذيب قوي لإزالة الشحوم والزيوت من الأسطح المعدنية.",
      price: 37.25,
      comparePrice: 45.00,
      images: ["https://images.unsplash.com/photo-1582719478185-2f9ef4f8fef3?w=800"],
      stock: 140,
      categoryId: categoryBySlug.solvents.id,
    },
    {
      name: "ملون أزرق للمنظفات",
      slug: "detergent-blue-colorant",
      description: "ملون ثابت ومناسب لتركيبات المنظفات المنزلية والصناعية.",
      price: 18.50,
      comparePrice: 24.00,
      images: ["https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800"],
      stock: 170,
      categoryId: categoryBySlug.colorants.id,
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
