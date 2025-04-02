import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ArtistGrid } from "@/components/artist-grid"

export const metadata: Metadata = {
  title: "Artists | Online Art Gallery",
  description: "Discover talented artists showcasing their work in our online art gallery.",
}

export default async function ArtistsPage() {
  const supabase = createClient()

  // Fetch artists with their artwork count
  const { data: artists } = await supabase
    .from("artists")
    .select(`
      *,
      artworks:artworks(count)
    `)
    .order("name")

  // Process artists data to include artwork count
  const processedArtists =
    artists?.map((artist) => ({
      ...artist,
      artwork_count: artist.artworks?.[0]?.count || 0,
    })) || []

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artists</h1>
          <p className="text-muted-foreground">
            Discover talented artists showcasing their work in our online art gallery.
          </p>
        </div>

        <ArtistGrid artists={processedArtists} />
      </div>
    </div>
  )
}

