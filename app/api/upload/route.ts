import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 })
  }

  try {
    const { image, folder } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "الصورة مطلوبة" }, { status: 400 })
    }

    const targetFolder =
      folder === "avatars" ? "teba/avatars" : "teba/products"

    const url = await uploadImage(image, targetFolder)
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Upload API error:", error)

    const details =
      error instanceof Error && error.message
        ? error.message
        : "خطأ غير متوقع"

    return NextResponse.json(
      { error: `فشل رفع الصورة: ${details}` },
      { status: 500 }
    )
  }
}
