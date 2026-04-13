import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const quickLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/categories", label: "الفئات" },
  { href: "/shop?sale=true", label: "العروض" },
  { href: "/about", label: "من نحن" },
] as const;

const categories = ["أحماض", "عطور", "مكثفات", "مبيضات", "عبوات"] as const;

const contactItems = [
  { icon: Phone, text: "01110292946" },
  { icon: Mail, text: "tiba.offical@gmail.com" },
  { icon: MapPin, text: "القاهرة، مصر" },
] as const;

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    label: "فيسبوك",
    className: "text-[#1877F2] hover:opacity-80",
    Icon: FaFacebookF,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/201110292946",
    label: "واتساب",
    className: "text-[#25D366] hover:opacity-80",
    Icon: FaWhatsapp,
  },
  {
    name: "Gmail",
    href: "mailto:tiba.offical@gmail.com",
    label: "جيميل",
    className: "text-[#EA4335] hover:opacity-80",
    Icon: MdEmail,
  },
] as const;

export function Footer() {
  return (
    <footer dir="rtl" className="mt-10 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 p-10 md:grid-cols-4">
        <div className="space-y-4 text-right">
          <div>
            <Link href="/" className="shrink-0">
              <Image
                src="/assets/logo.png"
                alt="Teba"
                width={116}
                height={32}
                priority
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              لتجارة وتوزيع خامات المنظفات
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            نوفر أفضل المواد الخام لصناعة المنظفات بجودة عالية وأسعار تنافسية
          </p>
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => {
              const Icon = item.Icon;

              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-border/60 transition-all hover:border-current ${item.className}`}>
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="text-right">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            روابط سريعة
          </h3>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-right">
          <h3 className="mb-4 text-sm font-medium text-foreground">الفئات</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <p key={category} className="text-sm text-muted-foreground">
                {category}
              </p>
            ))}
          </div>
        </div>

        <div className="text-right">
          <h3 className="mb-4 text-sm font-medium text-foreground">
            تواصل معنا
          </h3>
          <div className="space-y-3">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-[#00BFFF]" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-10 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2026 متجر طيبة - جميع الحقوق محفوظة
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00BFFF]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7B2FFF]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D9B]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#00CC66]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
