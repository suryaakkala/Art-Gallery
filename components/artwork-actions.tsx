"use client"

import { useState, useEffect } from "react"
import { Heart, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ArtworkActionsProps {
  artwork: {
    id: string
    title: string
  }
}

export function ArtworkActions({ artwork }: ArtworkActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from("user_favorites")
          .select()
          .eq("user_id", user.id)
          .eq("artwork_id", artwork.id)
          .single()

        setIsFavorited(!!data)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [supabase, artwork.id])

  const handleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save artworks to your favorites.",
      })
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      if (isFavorited) {
        await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("artwork_id", artwork.id)

        setIsFavorited(false)
        toast({
          title: "Removed from favorites",
          description: "This artwork has been removed from your favorites.",
        })
      } else {
        await supabase.from("user_favorites").insert({
          user_id: user.id,
          artwork_id: artwork.id,
        })

        setIsFavorited(true)
        toast({
          title: "Added to favorites",
          description: "This artwork has been added to your favorites.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your favorites.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: artwork.title,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied",
          description: "Artwork link copied to clipboard.",
        })
      }
    } catch (error) {
      // User cancelled share
    }
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button variant={isFavorited ? "default" : "outline"} onClick={handleFavorite} disabled={isLoading}>
        <Heart className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        {isFavorited ? "Favorited" : "Add to Favorites"}
      </Button>
      <Button variant="outline" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  )
}

