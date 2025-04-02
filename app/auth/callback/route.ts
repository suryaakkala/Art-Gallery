import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const isArtist = requestUrl.searchParams.get("is_artist") === "true"

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // If user is an artist, create artist profile
    if (isArtist) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if artist profile already exists
        const { data: existingArtist } = await supabase.from("artists").select().eq("user_id", user.id).single()

        if (!existingArtist) {
          // Create artist profile
          await supabase.from("artists").insert({
            user_id: user.id,
            name: user.user_metadata.full_name || user.email?.split("@")[0] || "Artist",
          })
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}

