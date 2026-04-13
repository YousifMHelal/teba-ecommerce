export function SalesChart() {
  const bars = [42, 65, 48, 78, 60, 90]

  return (
    <div className="flex h-64 items-end gap-3 rounded-[1.5rem] border border-black/5 bg-white/90 p-6">
      {bars.map((bar, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-3">
          <div className="w-full rounded-full bg-zinc-950/10" style={{ height: `${bar}%` }} />
          <span className="text-xs text-zinc-500">W{index + 1}</span>
        </div>
      ))}
    </div>
  )
}
