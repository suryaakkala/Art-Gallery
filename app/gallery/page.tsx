import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { GalleryFilters } from "@/components/gallery-filters"
import { ArtworkGrid } from "@/components/artwork-grid"

export const metadata: Metadata = {
  title: "Gallery | Online Art Gallery",
  description: "Browse and discover a diverse collection of artworks from talented artists around the world.",
}

interface GalleryPageProps {
  searchParams: {
    category?: string
    artist?: string
    search?: string
    sort?: string
    page?: string
  }
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const supabase = createClient()

  // Fetch categories for filter
  const { data: categories } = await supabase.from("categories").select("id, name").order("name")

  // Fetch artists for filter
  const { data: artists } = await supabase.from("artists").select("id, name").order("name")

  // Build query for artworks
  let query = supabase.from("artworks").select(`
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
    `)

  // Apply filters
  if (searchParams.category) {
    const category = categories?.find((c) => c.name.toLowerCase() === searchParams.category?.toLowerCase())
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  if (searchParams.artist) {
    const artist = artists?.find((a) => a.name.toLowerCase() === searchParams.artist?.toLowerCase())
    if (artist) {
      query = query.eq("artist_id", artist.id)
    }
  }

  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`)
  }

  // Apply sorting
  const sortField = searchParams.sort === "oldest" ? "created_at" : "created_at"
  const sortOrder = searchParams.sort === "oldest" ? { ascending: true } : { ascending: false }
  query = query.order(sortField, sortOrder)

  // Apply pagination
  const page = Number.parseInt(searchParams.page || "1")
  const pageSize = 12
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  // Execute query
  const { data: artworks, count } = await query

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">
            Browse and discover a diverse collection of artworks from talented artists around the world.
          </p>
        </div>

        <GalleryFilters categories={categories || []} artists={artists || []} />

        <ArtworkGrid artworks={artworks || []} totalCount={count || 0} currentPage={page} pageSize={pageSize} />
      </div>
    </div>
  )
}

