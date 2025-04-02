import Link from "next/link"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
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
  artists: Artist
  categories: Category | null
}

interface RelatedArtworksProps {
  artworks: Artwork[]
}

export function RelatedArtworks({ artworks }: RelatedArtworksProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </Card>
      ))}
    </div>
  )
}

