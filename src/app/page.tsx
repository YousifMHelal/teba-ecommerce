import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils"
import { sampleProducts } from "@/lib/constants";

const metrics = [
  { value: "12k+", label: "Orders shipped" },
  { value: "98%", label: "Satisfaction" },
  { value: "24h", label: "Fulfillment SLA" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 rounded-[2rem] border border-black/5 bg-white/80 p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] backdrop-blur md:grid-cols-[1.2fr_0.8fr] md:p-12">
        <div className="space-y-6">
          <Badge
            variant="secondary"
            className="w-fit rounded-full px-4 py-1 text-xs uppercase tracking-[0.28em]">
            Modern commerce
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-zinc-950 md:text-6xl">
              Teba turns a storefront into a fast, polished buying experience.
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-600 md:text-lg">
              A production-ready Next.js commerce foundation with account flows,
              admin surfaces, media uploads, and the primitives needed to scale.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className={buttonVariants({ size: "lg" })}>
              Browse store
            </Link>
            <Link
              href="/admin"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Open admin
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <Card key={metric.label} className="border-black/5 bg-white/90">
                <CardContent className="p-4">
                  <p className="text-2xl font-semibold text-zinc-950">
                    {metric.value}
                  </p>
                  <p className="text-sm text-zinc-500">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {sampleProducts.slice(0, 4).map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden border-black/5 bg-zinc-950 text-white">
              <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">
                    Featured
                  </p>
                  <h2 className="text-lg font-medium">{product.name}</h2>
                  <p className="text-sm text-zinc-300">{product.description}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>{product.category}</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
