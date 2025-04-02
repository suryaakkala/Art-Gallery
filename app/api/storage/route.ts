import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Verify authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if the user is an artist
    if (!user.user_metadata.is_artist) {
      return NextResponse.json({ error: "Only artists can upload images" }, { status: 403 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Return the data URL
    return NextResponse.json({ url: dataUrl })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        code: error.code || "UNKNOWN_ERROR",
      },
      { status: 500 },
    )
  }
}

