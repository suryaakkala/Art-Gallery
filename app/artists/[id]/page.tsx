import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Globe, Mail } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArtworkGrid } from "@/components/artwork-grid"

interface ArtistPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const supabase = createClient()

  const { data: artist } = await supabase.from("artists").select("name, bio").eq("id", params.id).single()

  if (!artist) {
    return {
      title: "Artist Not Found",
    }
  }

  return {
    title: `${artist.name} | Online Art Gallery`,
    description: artist.bio || `View artworks by ${artist.name} in our online art gallery.`,
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const supabase = createClient()

  // Fetch artist details
  const { data: artist } = await supabase
    .from("artists")
    .select(`
      *,
      user_id
    `)
    .eq("id", params.id)
    .single()

  if (!artist) {
    notFound()
  }

  // Fetch artist's artworks
  const { data: artworks, count } = await supabase
    .from("artworks")
    .select(
      `
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
    `,
      { count: "exact" },
    )
    .eq("artist_id", params.id)
    .order("created_at", { ascending: false })

  // Fetch artist's user email (for contact)
  const { data: userData } = await supabase.from("auth.users").select("email").eq("id", artist.user_id).single()

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/artists" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Artists
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={artist.profile_image_url || "/placeholder.svg?height=300&width=300"}
              alt={artist.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-6 space-y-4">
            <h1 className="text-2xl font-bold">{artist.name}</h1>

            <div className="flex flex-col gap-2">
              {artist.website_url && (
                <a
                  href={artist.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  {artist.website_url.replace(/^https?:\/\//, "")}
                </a>
              )}

              {userData?.email && (
                <a
                  href={`mailto:${userData.email}`}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Artist
                </a>
              )}
            </div>
          </div>
        </div>

        <div>
          {artist.bio && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-muted-foreground whitespace-pre-line">{artist.bio}</p>
            </div>
          )}

          <Separator className="my-6" />

          <div>
            <h2 className="text-xl font-semibold mb-6">Artworks ({count || 0})</h2>
            <ArtworkGrid artworks={artworks || []} totalCount={count || 0} currentPage={1} pageSize={12} />
          </div>
        </div>
      </div>
    </div>
  )
}

