"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { ChevronLeft, ChevronRight, Package, ShieldCheck, Truck, Users } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

// TODO: connect to CMS or DB
const slides = [
  {
    id: 1,
    image: "/assets/hero/slide-1.jpg",
    badge: "✦ جودة صناعية عالية",
    title: "خامات المنظفات الأصلية",
    subtitle: "كل ما تحتاجه لتصنيع منتجات المنظفات - بجودة مضمونة وأسعار الجملة",
    cta: "تسوّق الآن",
    ctaLink: "/shop",
    ctaSecondary: "اعرف أكثر",
    ctaSecondaryLink: "/about",
  },
  {
    id: 2,
    image: "/assets/hero/slide-2.jpg",
    badge: "🔥 عروض الكميات الكبيرة",
    title: "وفّر أكثر مع الطلبات بالجملة",
    subtitle: "أسعار مميزة مع الكميات الكبيرة - مناسب للمصانع والمحلات التجارية",
    cta: "تسوّق الآن",
    ctaLink: "/shop",
    ctaSecondary: "تواصل معنا",
    ctaSecondaryLink: "/contact",
  },
  {
    id: 3,
    image: "/assets/hero/slide-3.jpg",
    badge: "✨ منتجات جديدة",
    title: "تشكيلة متكاملة من خامات المنظفات",
    subtitle: "أحماض، عطور، مكثفات، وأكثر - كل شيء في مكان واحد",
    cta: "استعرض المنتجات",
    ctaLink: "/shop",
    ctaSecondary: "الفئات",
    ctaSecondaryLink: "/categories",
  },
] as const

const stats = [
  {
    icon: Package,
    title: "500+",
    label: "منتج متاح",
  },
  {
    icon: Users,
    title: "1000+",
    label: "عميل موثوق",
  },
  {
    icon: Truck,
    title: "شحن",
    label: "محافظات القاهرة الكبري ",
  },
  {
    icon: ShieldCheck,
    title: "ضمان",
    label: "جودة المواد",
  },
] as const

export default function HeroSection() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true }),
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    onSelect()
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <section className="w-full">
      <div
        className="relative"
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.play()}>
        <Carousel
          setApi={setApi}
          opts={{ loop: true, direction: "rtl" }}
          plugins={[autoplayPlugin.current]}
          className="w-full">
          <CarouselContent className="ml-0">
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="relative h-105 md:h-140">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={slide.id === 1}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

                  <div className="absolute right-8 bottom-10 left-8 text-right">
                    <span className="mb-4 inline-flex rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10 px-3 py-1 text-xs text-[#00BFFF]">
                      {slide.badge}
                    </span>
                    <h1 className="mb-3 text-3xl leading-tight font-medium text-white md:text-5xl">
                      {slide.title}
                    </h1>
                    <p className="mb-6 max-w-xl text-sm text-white/70 md:text-base">
                      {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap justify-start gap-3">
                      <Link
                        href={slide.ctaLink}
                        className="rounded-lg bg-[#00BFFF] px-6 py-3 text-sm font-medium text-black md:text-base">
                        {slide.cta}
                      </Link>
                      <Link
                        href={slide.ctaSecondaryLink}
                        className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 text-sm text-white backdrop-blur md:text-base">
                        {slide.ctaSecondary}
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="absolute top-1/2 right-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
          aria-label="السابق">
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="absolute top-1/2 left-4 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"
          aria-label="التالي">
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="absolute right-0 bottom-4 left-0 z-20 flex items-center justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                current === index ? "h-2 w-6 bg-[#00BFFF]" : "h-2 w-2 bg-white/30",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch border-b border-border bg-card py-5 text-right md:flex-nowrap">
        {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className={cn(
                "flex w-full items-center justify-center gap-2 px-6 py-2 md:w-1/4",
                index !== stats.length - 1 && "md:border-l md:border-border",
              )}>
              <Icon className="h-5 w-5 text-[#00BFFF]" />
              <div>
                <p className="text-sm font-bold text-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
