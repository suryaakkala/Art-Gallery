import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArtworkEditForm } from "@/components/artwork-edit-form"

interface EditArtworkPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: EditArtworkPageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: artwork } = await supabase.from("artworks").select("title").eq("id", params.id).single()

  if (!artwork) {
    return {
      title: "Artwork Not Found",
    }
  }

  return {
    title: `Edit ${artwork.title} | Artist Dashboard`,
    description: "Edit your artwork details.",
  }
}

export default async function EditArtworkPage({ params }: EditArtworkPageProps) {
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

  // Fetch artwork details
  const { data: artwork } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", params.id)
    .eq("artist_id", artist.id)
    .single()

  if (!artwork) {
    notFound()
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
        <h1 className="text-3xl font-bold mb-6">Edit Artwork</h1>

        <ArtworkEditForm artwork={artwork} categories={categories || []} />
      </div>
    </div>
  )
}

