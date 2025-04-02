import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"

export const metadata: Metadata = {
  title: "Profile | Online Art Gallery",
  description: "View and edit your profile information.",
}

export default async function ProfilePage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's artist profile if they are an artist
  let artistProfile = null
  if (user.user_metadata.is_artist) {
    const { data: artist } = await supabase.from("artists").select("*").eq("user_id", user.id).single()

    artistProfile = artist
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <ProfileForm user={user} artistProfile={artistProfile} />
      </div>
    </div>
  )
}

