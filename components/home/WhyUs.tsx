import { Headphones, Package, ShieldCheck, Truck } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    iconColor: "text-[#00BFFF]",
    iconBg: "bg-[#00BFFF]/10",
    title: "جودة مضمونة",
    desc: "جميع موادنا معتمدة ومختبرة للاستخدام الصناعي",
  },
  {
    icon: Truck,
    iconColor: "text-[#7B2FFF]",
    iconBg: "bg-[#7B2FFF]/10",
    title: "شحن سريع",
    desc: "توصيل لجميع محافظات القاهرة الكبري خلال 1-3 أيام عمل",
  },
  {
    icon: Package,
    iconColor: "text-[#FF2D9B]",
    iconBg: "bg-[#FF2D9B]/10",
    title: "كميات مرنة",
    desc: "نبيع بالقطاعي والجملة - من كيلو واحد لأطنان",
  },
  {
    icon: Headphones,
    iconColor: "text-[#00CC66]",
    iconBg: "bg-[#00CC66]/10",
    title: "دعم متخصص",
    desc: "فريقنا من الكيميائيين جاهز لمساعدتك في اختيار المواد",
  },
] as const

export default function WhyUs() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-center text-2xl font-medium text-foreground">
        لماذا تختار طيبة؟
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 text-right">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}>
                <Icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="mt-4 mb-2 text-base font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
