import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "الصورة مطلوبة" }, { status: 400 })
    }

    const url = await uploadImage(image)
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json(
      { error: "فشل رفع الصورة، حاول مرة أخرى" },
      { status: 500 }
    )
  }
}
