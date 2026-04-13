import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <Card className="border-black/5 bg-white/90">
      <CardContent className="space-y-4 p-6">
        <h1 className="text-3xl font-semibold text-zinc-950">Profile</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input id="profile-email" type="email" />
          </div>
        </div>
        <Button>Save changes</Button>
      </CardContent>
    </Card>
  )
}
