"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Upload } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"

interface Category {
  id: string
  name: string
}

interface Artwork {
  id: string
  title: string
  description: string | null
  category_id: string | null
  image_url: string
  medium: string | null
  dimensions: string | null
  year_created: number | null
  is_featured: boolean
}

interface ArtworkEditFormProps {
  artwork: Artwork
  categories: Category[]
}

export function ArtworkEditForm({ artwork, categories }: ArtworkEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(artwork.title)
  const [description, setDescription] = useState(artwork.description || "")
  const [categoryId, setCategoryId] = useState(artwork.category_id || "")
  const [medium, setMedium] = useState(artwork.medium || "")
  const [dimensions, setDimensions] = useState(artwork.dimensions || "")
  const [yearCreated, setYearCreated] = useState<number | "">(artwork.year_created || "")
  const [isFeatured, setIsFeatured] = useState(artwork.is_featured)
  const [artworkImage, setArtworkImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(artwork.image_url)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArtworkImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Convert image to base64 directly
  const imageToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const uploadImageToServer = async (file: File): Promise<string> => {
    try {
      // For large files, use the server API to handle the conversion
      if (file.size > 1024 * 1024) {
        // If larger than 1MB
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/storage", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to upload image")
        }

        return data.url
      } else {
        // For smaller files, convert directly in the browser
        return await imageToBase64(file)
      }
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = artwork.image_url

      // Upload new artwork image if changed
      if (artworkImage) {
        try {
          // Try to upload via server API or direct base64
          imageUrl = await uploadImageToServer(artworkImage)
          console.log("New image processed successfully")
        } catch (uploadError) {
          console.error("Failed to process image, keeping existing:", uploadError)

          // Keep existing image URL
          toast({
            title: "Image processing failed",
            description: "We couldn't update your artwork image, but saved the other changes.",
            variant: "warning",
          })
        }
      }

      // Update artwork record
      const { error: updateError } = await supabase
        .from("artworks")
        .update({
          title,
          description: description || null,
          category_id: categoryId || null,
          image_url: imageUrl,
          medium: medium || null,
          dimensions: dimensions || null,
          year_created: yearCreated || null,
          is_featured: isFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", artwork.id)

      if (updateError) {
        console.error("Update error:", updateError)
        throw updateError
      }

      toast({
        title: "Artwork updated",
        description: "Your artwork has been successfully updated.",
      })

      router.push("/artist-dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating artwork:", error)
      toast({
        title: "Error updating artwork",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/4] mb-4 overflow-hidden rounded-md">
                <Image
                  src={imagePreview || "/placeholder.svg?height=400&width=300"}
                  alt="Artwork preview"
                  fill
                  className="object-contain"
                />
              </div>

              <Label htmlFor="artworkImage" className="cursor-pointer">
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Upload className="h-4 w-4" />
                  <span>Change Image</span>
                </div>
                <Input
                  id="artworkImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </Label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category" disabled={isLoading}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your artwork..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  placeholder="e.g., Oil on canvas"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  placeholder="e.g., 24 x 36 inches"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearCreated">Year Created</Label>
                <Input
                  id="yearCreated"
                  type="number"
                  placeholder="e.g., 2023"
                  value={yearCreated}
                  onChange={(e) => setYearCreated(e.target.value ? Number.parseInt(e.target.value) : "")}
                  disabled={isLoading}
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked === true)}
                disabled={isLoading}
              />
              <Label htmlFor="featured">Feature this artwork on the homepage</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/artist-dashboard")} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}

