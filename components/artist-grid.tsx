import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Artist {
  id: string
  name: string
  profile_image_url: string | null
  bio: string | null
  artwork_count: number
}

interface ArtistGridProps {
  artists: Artist[]
}

export function ArtistGrid({ artists }: ArtistGridProps) {
  if (!artists.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No artists found</h3>
        <p className="text-muted-foreground mb-6">Check back soon for new artists.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artists.map((artist) => (
        <Card key={artist.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <Image
              src={artist.profile_image_url || "/placeholder.svg?height=300&width=300"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <Link href={`/artists/${artist.id}`}>
              <h3 className="font-semibold text-lg hover:underline">{artist.name}</h3>
            </Link>
            {artist.bio && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{artist.bio}</p>}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {artist.artwork_count} {artist.artwork_count === 1 ? "artwork" : "artworks"}
            </span>
            <Button size="sm" asChild>
              <Link href={`/artists/${artist.id}`}>View Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

