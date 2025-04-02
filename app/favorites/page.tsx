import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ArtworkGrid } from "@/components/artwork-grid"

export const metadata: Metadata = {
  title: "My Favorites | Online Art Gallery",
  description: "View your favorite artworks from the gallery.",
}

export default async function FavoritesPage() {
  const supabase = createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's favorite artworks
  const { data: favorites, count } = await supabase
    .from("user_favorites")
    .select(
      `
      artwork_id,
      artworks!inner (
        *,
        artists (
          id,
          name,
          profile_image_url
        ),
        categories (
          id,
          name
        )
      )
    `,
      { count: "exact" },
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Transform data to match ArtworkGrid component format
  const favoriteArtworks = favorites?.map((fav) => fav.artworks) || []

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          <p className="text-muted-foreground">Your collection of favorite artworks from the gallery.</p>
        </div>

        {favoriteArtworks.length > 0 ? (
          <ArtworkGrid
            artworks={favoriteArtworks}
            totalCount={count || 0}
            currentPage={1}
            pageSize={favoriteArtworks.length}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6">Browse the gallery and add artworks to your favorites.</p>
            <Button asChild>
              <Link href="/gallery">Explore Gallery</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

