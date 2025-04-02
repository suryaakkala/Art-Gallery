import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Artist {
  id: string
  name: string
  profile_image_url: string | null
}

interface Category {
  name: string
}

interface Artwork {
  id: string
  title: string
  image_url: string
  medium: string | null
  year_created: number | null
  artists: Artist
  categories: Category | null
}

interface FeaturedArtworksProps {
  artworks: Artwork[]
}

export function FeaturedArtworks({ artworks }: FeaturedArtworksProps) {
  if (!artworks.length) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-[3/4] relative bg-muted">
              <Image src="/placeholder.svg?height=400&width=300" alt="Placeholder" fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">Sample Artwork</h3>
              <p className="text-sm text-muted-foreground">Artist Name</p>
            </CardContent>
          </Card>
        ))}
      </>
    )
  }

  return (
    <>
      {artworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden">
          <Link href={`/gallery/${artwork.id}`}>
            <div className="aspect-[3/4] relative">
              <Image
                src={artwork.image_url || "/placeholder.svg?height=400&width=300"}
                alt={artwork.title}
                fill
                className="object-cover transition-all hover:scale-105"
              />
            </div>
          </Link>
          <CardContent className="p-4">
            <Link href={`/gallery/${artwork.id}`}>
              <h3 className="font-semibold hover:underline">{artwork.title}</h3>
            </Link>
            <div className="flex items-center mt-2">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={artwork.artists.profile_image_url || ""} />
                <AvatarFallback>{artwork.artists.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Link href={`/artists/${artwork.artists.id}`} className="text-sm hover:underline">
                {artwork.artists.name}
              </Link>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex gap-2">
              {artwork.categories && <Badge variant="secondary">{artwork.categories.name}</Badge>}
              {artwork.medium && <Badge variant="outline">{artwork.medium}</Badge>}
            </div>
            {artwork.year_created && <span className="text-xs text-muted-foreground">{artwork.year_created}</span>}
          </CardFooter>
        </Card>
      ))}
    </>
  )
}

