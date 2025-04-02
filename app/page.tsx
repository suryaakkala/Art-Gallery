import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Palette } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeaturedArtworks } from "@/components/featured-artworks"

export const metadata: Metadata = {
  title: "Online Art Gallery - Discover Beautiful Artworks",
  description:
    "Explore a curated collection of paintings, sculptures, photographs, and digital art from talented artists around the world.",
}

export default async function Home() {
  const supabase = createClient()

  // Fetch featured artworks
  const { data: featuredArtworks } = await supabase
    .from("artworks")
    .select(`
      *,
      artists (
        id,
        name,
        profile_image_url
      ),
      categories (
        name
      )
    `)
    .eq("is_featured", true)
    .limit(6)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover Beautiful Artworks
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Explore a curated collection of paintings, sculptures, photographs, and digital art from talented
                  artists around the world.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/gallery">
                    Explore Gallery
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/artists">Meet Our Artists</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[500px] aspect-square relative overflow-hidden rounded-xl">
              <Image
                src="https://img.freepik.com/free-photo/digital-art-flower-landscape-painting_23-2151596839.jpg"
                alt="Featured Artwork"
                width={500}
                height={500}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                <div className="flex items-center">
                  <Palette className="mr-1 h-4 w-4" />
                  <span>Featured Artworks</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Curated Selection</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our handpicked selection of exceptional artworks from talented artists.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <FeaturedArtworks artworks={featuredArtworks || []} />
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/gallery">
                View All Artworks
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Browse by Category</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore artworks by medium and style to find exactly what you're looking for.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <Card className="overflow-hidden">
              <Link href="/gallery?category=painting">
                <div className="aspect-square relative">
                  <Image
                    src="https://www.parkwestgallery.com/wp-content/uploads/2017/06/person-woman-art-creative.jpg"
                    alt="Painting"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Painting</h3>
                </CardContent>
              </Link>
            </Card>
            <Card className="overflow-hidden">
              <Link href="/gallery?category=photography">
                <div className="aspect-square relative">
                  <Image
                    src="https://i.pinimg.com/originals/42/c0/12/42c01262e063bf13fc3ed665a2db8501.jpg"
                    alt="Photography"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Photography</h3>
                </CardContent>
              </Link>
            </Card>
            <Card className="overflow-hidden">
              <Link href="/gallery?category=sculpture">
                <div className="aspect-square relative">
                  <Image
                    src="https://images.adsttc.com/media/images/641d/d21e/5e7a/1362/d621/455e/large_jpg/the-museum-of-art-and-photography-bangalore-mathew-and-ghosh-architects_8.jpg?1679675953"
                    alt="Sculpture"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Sculpture</h3>
                </CardContent>
              </Link>
            </Card>
            <Card className="overflow-hidden">
              <Link href="/gallery?category=digital-art">
                <div className="aspect-square relative">
                  <Image
                    src="https://r4.wallpaperflare.com/wallpaper/892/692/922/howl-s-moving-castle-studio-ghibli-fantasy-art-clouds-daylight-hd-wallpaper-3be62c2d93012fc995842bf94d4cdc00.jpg"
                    alt="Digital Art"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Digital Art</h3>
                </CardContent>
              </Link>
            </Card>
            <Card className="overflow-hidden">
              <Link href="/gallery?category=mixed-media">
                <div className="aspect-square relative">
                  <Image
                    src="https://kotart.in/cdn/shop/files/CanvasAS36722.jpg?v=1697561064"
                    alt="Mixed Media"
                    fill
                    className="object-cover transition-all hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">Mixed Media</h3>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

