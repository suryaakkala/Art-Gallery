import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArtworkActions } from "@/components/artwork-actions"
import { RelatedArtworks } from "@/components/related-artworks"

interface ArtworkPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: artwork } = await supabase
    .from("artworks")
    .select(`
      title,
      description,
      artists (name)
    `)
    .eq("id", params.id)
    .single()

  if (!artwork) {
    return {
      title: "Artwork Not Found",
    }
  }

  return {
    title: `${artwork.title} by ${artwork.artists.name} | Online Art Gallery`,
    description: artwork.description || `View ${artwork.title} by ${artwork.artists.name} in our online art gallery.`,
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const supabase = createClient()

  // Increment view count
  await supabase.rpc("increment_artwork_views", { artwork_id: params.id })

  // Fetch artwork details
  const { data: artwork } = await supabase
    .from("artworks")
    .select(`
      *,
      artists (
        id,
        name,
        bio,
        profile_image_url,
        website_url
      ),
      categories (
        id,
        name
      )
    `)
    .eq("id", params.id)
    .single()

  if (!artwork) {
    notFound()
  }

  // Fetch related artworks (same artist or category)
  const { data: relatedArtworks } = await supabase
    .from("artworks")
    .select(`
      id,
      title,
      image_url,
      artists (
        id,
        name,
        profile_image_url
      ),
      categories (
        name
      )
    `)
    .or(`artist_id.eq.${artwork.artist_id},category_id.eq.${artwork.category_id}`)
    .neq("id", artwork.id)
    .limit(4)

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/gallery" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Gallery
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          <Image
            src={artwork.image_url || "/placeholder.svg?height=800&width=600"}
            alt={artwork.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{artwork.title}</h1>
            <Link href={`/artists/${artwork.artists.id}`} className="text-lg hover:underline">
              {artwork.artists.name}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {artwork.categories && <Badge variant="secondary">{artwork.categories.name}</Badge>}
            {artwork.medium && <Badge variant="outline">{artwork.medium}</Badge>}
            {artwork.year_created && <Badge variant="outline">{artwork.year_created}</Badge>}
          </div>

          {artwork.description && (
            <div className="mt-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">{artwork.description}</p>
            </div>
          )}

          {artwork.dimensions && (
            <div>
              <h3 className="font-semibold">Dimensions</h3>
              <p className="text-muted-foreground">{artwork.dimensions}</p>
            </div>
          )}

          <ArtworkActions artwork={artwork} />

          <Separator className="my-4" />

          <div>
            <h3 className="font-semibold mb-2">About the Artist</h3>
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/artists/${artwork.artists.id}`}>
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={artwork.artists.profile_image_url || "/placeholder.svg?height=64&width=64"}
                    alt={artwork.artists.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
              <div>
                <Link href={`/artists/${artwork.artists.id}`} className="font-medium hover:underline">
                  {artwork.artists.name}
                </Link>
                {artwork.artists.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{artwork.artists.bio}</p>
                )}
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/artists/${artwork.artists.id}`}>View Artist Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      {relatedArtworks && relatedArtworks.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Artworks</h2>
          <RelatedArtworks artworks={relatedArtworks} />
        </div>
      )}
    </div>
  )
}

