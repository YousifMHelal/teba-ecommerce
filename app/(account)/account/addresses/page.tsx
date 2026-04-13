import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AddressesPage() {
  return (
    <div className="space-y-4">
      <Card className="border-black/5 bg-white/90">
        <CardContent className="space-y-2 p-6">
          <h1 className="text-3xl font-semibold text-zinc-950">Addresses</h1>
          <p className="text-zinc-600">Manage default shipping and billing addresses.</p>
        </CardContent>
      </Card>
      <Button>Add address</Button>
    </div>
  )
}
