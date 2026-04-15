import Link from "next/link"
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react"
import { FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

import { APP_NAME } from "@/lib/constants"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "من نحن",
  description: `تعرف على ${APP_NAME} ورؤيتنا في توفير خامات المنظفات بجودة موثوقة وأسعار مناسبة.`,
}

const stats = [
  { value: "500+", label: "منتج متاح", icon: Package },
  { value: "1000+", label: "عميل يثق بنا", icon: Users },
  { value: "24/7", label: "متابعة للطلبات", icon: ShieldCheck },
  { value: "سريع", label: "تجهيز وشحن", icon: Truck },
] as const

const values = [
  {
    title: "جودة يمكن الاعتماد عليها",
    description: "نختار الخامات بعناية ونركز على الثبات والأداء العملي في الاستخدام اليومي.",
  },
  {
    title: "أسعار واضحة وتنافسية",
    description: "نوفر تسعيرًا مناسبًا للطلبات الفردية والكميات الكبيرة بدون تعقيد.",
  },
  {
    title: "خدمة سريعة ومباشرة",
    description: "نهتم بسرعة الرد، وضوح التفاصيل، وتسهيل الوصول للمنتج المناسب.",
  },
] as const

const contactLinks = [
  {
    label: "اتصال هاتفي",
    value: "01110292946",
    href: "tel:+201110292946",
    icon: Phone,
  },
  {
    label: "البريد الإلكتروني",
    value: "tiba.offical@gmail.com",
    href: "mailto:tiba.offical@gmail.com",
    icon: Mail,
  },
  {
    label: "واتساب",
    value: "مراسلة سريعة",
    href: "https://wa.me/201110292946",
    icon: FaWhatsapp,
  },
  {
    label: "فيسبوك",
    value: "تابعنا على الصفحة",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    label: "العنوان",
    value: "القاهرة، مصر",
    href: "https://maps.google.com/?q=القاهرة، مصر",
    icon: MapPin,
  },
] as const

const steps = [
  "استعراض الفئات والمنتجات من المتجر",
  "اختيار المنتجات المناسبة وإضافة الكمية المطلوبة",
  "إتمام الطلب ومتابعة التجهيز والتوصيل",
] as const

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-card via-card to-muted/25 p-6 shadow-sm sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,191,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,184,0,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              من نحن
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              شريكك في خامات المنظفات الموثوقة
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {APP_NAME} يركز على توفير خامات ومنتجات تساعدك في الوصول إلى نتائج عملية وجودة ثابتة،
              مع تجربة شراء بسيطة تناسب الأفراد وأصحاب الأعمال والمصانع الصغيرة.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={cn(buttonVariants(), "h-auto rounded-2xl px-5 py-3") }>
              تصفح المتجر
            </Link>
            <Link
              href="/categories"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-auto rounded-2xl px-5 py-3",
              )}>
              استعرض الفئات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.label} className="border-border/70 bg-card/90">
              <CardHeader className="flex-row items-center justify-between space-y-0 border-b border-border/60 pb-4">
                <div>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="mt-1 text-2xl font-bold">
                    {stat.value}
                  </CardTitle>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-4 text-sm text-muted-foreground">
                نركز على التجربة العملية والسريعة التي تساعدك على الشراء بثقة.
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-xl">رؤيتنا</CardTitle>
            <CardDescription>
              أن تكون تجربة شراء خامات المنظفات واضحة، سريعة، وموثوقة من أول زيارة حتى استلام الطلب.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              نؤمن أن نجاح العميل يبدأ من توفر المنتج المناسب بالمواصفة الصحيحة، لذلك نهتم
              بتقديم تشكيلة عملية من الخامات الأساسية والمنتجات الداعمة التي يحتاجها السوق.
            </p>
            <p>
              هدفنا ليس فقط عرض المنتجات، بل تبسيط الوصول إليها، مع إبراز الفئات، وتسهيل المقارنة،
              ومتابعة الطلب بطريقة مريحة وواضحة.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="text-xl">كيف نعمل</CardTitle>
            <CardDescription>
              خطوات بسيطة تجعل الوصول للمنتج المناسب أسرع.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-border/60 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="pt-1 text-sm leading-6 text-muted-foreground">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title} className="border-border/70">
            <CardHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{value.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {value.description}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 max-w-2xl space-y-2">
          <h2 className="text-2xl font-bold">تواصل معنا</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            اختر وسيلة التواصل الأنسب لك، وسنكون جاهزين للرد والمساعدة.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {contactLinks.map((contact) => {
            const Icon = contact.icon

            return (
              <Link
                key={contact.label}
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                className="group rounded-2xl border border-border/70 bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground">{contact.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{contact.value}</p>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-bold">جاهز تبدأ؟</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              استعرض المنتجات أو انتقل مباشرة إلى الأقسام المناسبة لاحتياجك.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants(), "h-auto rounded-2xl px-5 py-3")}>
              ابدأ التسوق
            </Link>
            <Link
              href="/categories"
              className={cn(buttonVariants({ variant: "outline" }), "h-auto rounded-2xl px-5 py-3") }>
              الأقسام
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
