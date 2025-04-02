"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Edit, Eye, Trash2 } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Artist {
  id: string
  name: string
  profile_image_url: string | null
  bio: string | null
  website_url: string | null
}

interface Category {
  id: string
  name: string
}

interface Artwork {
  id: string
  title: string
  description: string | null
  image_url: string
  medium: string | null
  dimensions: string | null
  year_created: number | null
  is_featured: boolean
  views_count: number
  created_at: string
  categories: Category | null
}

interface ArtistDashboardTabsProps {
  artist: Artist
  artworks: Artwork[]
  categories: Category[]
}

export function ArtistDashboardTabs({ artist, artworks, categories }: ArtistDashboardTabsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [artworkToDelete, setArtworkToDelete] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteArtwork = async () => {
    if (!artworkToDelete) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("artworks").delete().eq("id", artworkToDelete)

      if (error) throw error

      toast({
        title: "Artwork deleted",
        description: "The artwork has been successfully deleted.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error deleting artwork",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setArtworkToDelete(null)
    }
  }

  // Calculate statistics
  const totalViews = artworks.reduce((sum, artwork) => sum + artwork.views_count, 0)
  const totalArtworks = artworks.length
  const featuredArtworks = artworks.filter((artwork) => artwork.is_featured).length

  return (
    <Tabs defaultValue="artworks" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="artworks">My Artworks</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
      </TabsList>

      <TabsContent value="artworks">
        {artworks.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artwork</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden md:table-cell">Views</TableHead>
                  <TableHead className="hidden md:table-cell">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artworks.map((artwork) => (
                  <TableRow key={artwork.id}>
                    <TableCell>
                      <div className="w-16 h-16 relative rounded overflow-hidden">
                        <Image
                          src={artwork.image_url || "/placeholder.svg?height=64&width=64"}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <p className="truncate max-w-[150px]">{artwork.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(artwork.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {artwork.categories?.name && <Badge variant="outline">{artwork.categories.name}</Badge>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{artwork.views_count}</TableCell>
                    <TableCell className="hidden md:table-cell">{artwork.is_featured ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/gallery/${artwork.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/artist-dashboard/edit/${artwork.id}`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setArtworkToDelete(artwork.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the artwork "{artwork.title}"
                                from the gallery.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteArtwork}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No artworks yet</h3>
            <p className="text-muted-foreground mb-6">Upload your first artwork to showcase in the gallery.</p>
            <Button asChild>
              <Link href="/artist-dashboard/upload">Upload Artwork</Link>
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="stats">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArtworks}</div>
              <p className="text-xs text-muted-foreground">{featuredArtworks} featured</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                {totalArtworks > 0 ? Math.round(totalViews / totalArtworks) : 0} avg. per artwork
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateProfileCompleteness(artist)}%</div>
              <p className="text-xs text-muted-foreground">
                {artist.bio ? "Bio added" : "Add a bio to improve your profile"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Most Viewed Artworks</CardTitle>
            <CardDescription>Your top performing artworks based on view count.</CardDescription>
          </CardHeader>
          <CardContent>
            {artworks.length > 0 ? (
              <div className="space-y-4">
                {[...artworks]
                  .sort((a, b) => b.views_count - a.views_count)
                  .slice(0, 5)
                  .map((artwork) => (
                    <div key={artwork.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded overflow-hidden">
                        <Image
                          src={artwork.image_url || "/placeholder.svg?height=48&width=48"}
                          alt={artwork.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{artwork.title}</p>
                        <p className="text-sm text-muted-foreground">{artwork.categories?.name || "Uncategorized"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{artwork.views_count}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No artwork statistics available yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function calculateProfileCompleteness(artist: Artist): number {
  let completeness = 0
  const totalFields = 3 // name, bio, profile_image_url

  if (artist.name) completeness++
  if (artist.bio) completeness++
  if (artist.profile_image_url) completeness++

  return Math.round((completeness / totalFields) * 100)
}

