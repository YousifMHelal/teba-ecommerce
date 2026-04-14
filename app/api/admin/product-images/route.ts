import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  validateProductImages,
  addPlaceholderImagesToEmptyProducts,
} from "@/lib/actions/product-images.actions"


export async function GET(request: NextRequest) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 403 }
    )
  }

  try {
    const result = await validateProductImages()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to validate product images",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized - Admin access required" },
      { status: 403 }
    )
  }

  const { action } = await request.json()

  if (action === "fix-empty") {
    try {
      const result = await addPlaceholderImagesToEmptyProducts()
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to fix product images",
        },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: "Invalid action" },
    { status: 400 }
  )
}
