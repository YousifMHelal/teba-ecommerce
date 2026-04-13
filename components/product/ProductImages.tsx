type ProductImagesProps = {
  images?: string[]
}

export function ProductImages({ images = [] }: ProductImagesProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-[1.75rem] bg-gradient-to-br from-zinc-200 to-zinc-100 shadow-inner" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="aspect-square rounded-2xl bg-zinc-100" />
        ))}
      </div>
      {images.length > 0 ? null : null}
    </div>
  )
}
