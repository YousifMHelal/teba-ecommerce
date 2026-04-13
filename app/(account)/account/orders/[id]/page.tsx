type OrderDetailPageProps = {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <main className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <h1 className="text-3xl font-semibold text-zinc-950">Order {params.id}</h1>
      <p className="text-zinc-600">Order details and fulfillment timeline will render here.</p>
    </main>
  )
}
