import Link from "next/link"
import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main
      lang="ar"
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 font-(family-name:--font-cairo)"
    >
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <span className="select-none text-[180px] font-black leading-none text-foreground/30 sm:text-[220px]">
            4
          </span>

          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-bounce rounded-full border border-primary/30 bg-primary/10 p-5 shadow-lg shadow-primary/20">
              <Frown className="h-12 w-12 text-primary sm:h-14 sm:w-14" />
            </div>
          </div>

          <span className="select-none text-[180px] font-black leading-none text-foreground/30 sm:text-[220px]">
            4
          </span>
        </div>

        <h1 className="mt-8 text-3xl font-extrabold text-foreground sm:text-4xl">
          الصفحة غير موجودة
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>

        <Button
          asChild
          size="lg"
          className="mt-8 h-14 px-10 text-lg font-bold shadow-lg shadow-primary/30"
        >
          <Link href="/">العودة للرئيسية</Link>
        </Button>
      </section>
    </main>
  )
}
