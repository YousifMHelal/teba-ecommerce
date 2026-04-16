export const dynamic = "force-dynamic";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/home/HowItWorks";
import PromoBanner from "@/components/home/PromoBanner";

export const metadata = {
  title: "Teba",
  description:
    "تسوق أفضل خامات المنظفات بجودة صناعية وأسعار الجملة - شحن لجميع محافظات مصر",
};

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <WhyUs />
      <HowItWorks />
      <PromoBanner />
    </main>
  );
}
