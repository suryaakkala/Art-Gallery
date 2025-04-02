import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ArtistDashboardTabs } from "@/components/artist-dashboard-tabs"

export const metadata: Metadata = {
  title: "Artist Dashboard | Online Art Gallery",
  description: "Manage your artworks and artist profile.",
}

export default async function ArtistDashboardPage() {
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
  const { data: artist } = await supabase.from("artists").select("*").eq("user_id", user.id).single()

  if (!artist) {
    redirect("/")
  }

  // Fetch artist's artworks
  const { data: artworks, count } = await supabase
    .from("artworks")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `,
      { count: "exact" },
    )
    .eq("artist_id", artist.id)
    .order("created_at", { ascending: false })

  // Fetch categories for artwork form
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Artist Dashboard</h1>
            <p className="text-muted-foreground">Manage your artworks and track their performance.</p>
          </div>

          <Button asChild>
            <Link href="/artist-dashboard/upload">
              <PlusCircle className="mr-2 h-4 w-4" />
              Upload Artwork
            </Link>
          </Button>
        </div>

        <ArtistDashboardTabs artist={artist} artworks={artworks || []} categories={categories || []} />
      </div>
    </div>
  )
}

