import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArtworkUploadForm } from "@/components/artwork-upload-form"

export const metadata: Metadata = {
  title: "Upload Artwork | Artist Dashboard",
  description: "Upload a new artwork to your gallery.",
}

export default async function UploadArtworkPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is an artist
  if (!user.user_metadata.is_artist) {
    redirect("/")
  }

  // Fetch artist profile
  const { data: artist } = await supabase.from("artists").select("id").eq("user_id", user.id).single()

  if (!artist) {
    redirect("/")
  }

  // Fetch categories for artwork form
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/artist-dashboard" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload New Artwork</h1>

        <ArtworkUploadForm artistId={artist.id} categories={categories || []} />
      </div>
    </div>
  )
}

