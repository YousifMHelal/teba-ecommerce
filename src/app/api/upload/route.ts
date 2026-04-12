import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    filename: file.name,
    size: file.size,
  })
}
