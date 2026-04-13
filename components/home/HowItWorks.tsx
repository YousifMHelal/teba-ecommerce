import { Search, ShoppingCart, Truck } from "lucide-react"

const steps = [
  {
    number: "1",
    icon: Search,
    title: "ابحث عن منتجك",
    desc: "تصفح فئاتنا أو ابحث بالاسم العلمي أو التجاري",
  },
  {
    number: "2",
    icon: ShoppingCart,
    title: "أضف للسلة واطلب",
    desc: "اختر الكمية المناسبة وأتمم الطلب بسهولة",
  },
  {
    number: "3",
    icon: Truck,
    title: "استلم على بابك",
    desc: "نجهز طلبك ونوصله لأي مكان في مصر",
  },
] as const

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="mb-10 text-center text-2xl font-medium text-foreground">كيف تطلب؟</h2>

      <div className="flex flex-col items-start gap-3 md:flex-row md:items-start md:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <div key={step.number} className="contents">
              <article className="w-full text-center md:w-auto md:flex-1">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-medium text-[#00BFFF]">{step.number}</span>
                    <Icon className="h-4 w-4 text-[#00BFFF]" />
                  </div>
                </div>
                <h3 className="mt-4 mb-2 text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-50 text-sm text-muted-foreground">{step.desc}</p>
              </article>

              {index < steps.length - 1 && (
                <div className="mt-8 hidden flex-1 border-t border-dashed border-border md:block" />
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
