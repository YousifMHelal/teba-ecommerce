type AdminOrderDetailPageProps = {
  params: {
    id: string
  }
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  return (
    <main className="space-y-4 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      <h1 className="text-3xl font-semibold text-zinc-950">Order {params.id}</h1>
      <p className="text-zinc-600">Administrative order controls will live here.</p>
    </main>
  )
}
