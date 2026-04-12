import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-16">
      <Card className="w-full border-black/5 bg-white/90">
        <CardContent className="space-y-6 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Welcome back</p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-950">Sign in</h1>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
