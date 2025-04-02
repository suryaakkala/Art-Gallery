import Link from "next/link"
import Image from "next/image"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Artist {
  id: string
  name: string
  profile_image_url: string | null
}

interface Category {
  id: string
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

interface ArtworkGridProps {
  artworks: Artwork[]
  totalCount: number
  currentPage: number
  pageSize: number
}

export function ArtworkGrid({ artworks, totalCount, currentPage, pageSize }: ArtworkGridProps) {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (!artworks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">No artworks found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your filters or search criteria.</p>
        <Link href="/gallery">
          <Button>View All Artworks</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </div>

      {totalPages > 1 && (
        <Pagination className="mx-auto">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/gallery?page=${currentPage - 1}`} />
              </PaginationItem>
            )}

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum: number

              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink href={`/gallery?page=${pageNum}`} isActive={pageNum === currentPage}>
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/gallery?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

