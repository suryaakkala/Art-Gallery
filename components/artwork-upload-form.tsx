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

interface ArtworkUploadFormProps {
  artistId: string
  categories: Category[]
}

export function ArtworkUploadForm({ artistId, categories }: ArtworkUploadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [medium, setMedium] = useState("")
  const [dimensions, setDimensions] = useState("")
  const [yearCreated, setYearCreated] = useState<number | "">("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [artworkImage, setArtworkImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("Image selected:", file.name, file.size)
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
    console.log("Form submitted", { title, categoryId, artworkImage })

    if (!artworkImage) {
      toast({
        title: "Image required",
        description: "Please upload an image of your artwork.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Get image URL (either from server or as base64)
      let imageUrl

      try {
        // Try to upload via server API or direct base64
        imageUrl = await uploadImageToServer(artworkImage)
        console.log("Image processed successfully")
      } catch (uploadError) {
        console.error("Failed to process image, using placeholder:", uploadError)

        // Use a placeholder URL if all else fails
        imageUrl = `/placeholder.svg?height=800&width=600&text=${encodeURIComponent(title)}`
        toast({
          title: "Image processing failed",
          description: "We couldn't process your image. A placeholder has been used instead.",
          variant: "warning",
        })
      }

      // Create artwork record
      const { error: insertError, data: insertData } = await supabase
        .from("artworks")
        .insert({
          title,
          description: description || null,
          artist_id: artistId,
          category_id: categoryId || null,
          image_url: imageUrl,
          medium: medium || null,
          dimensions: dimensions || null,
          year_created: yearCreated || null,
          is_featured: isFeatured,
          views_count: 0,
        })
        .select()

      if (insertError) {
        console.error("Insert error:", insertError)
        throw insertError
      }

      console.log("Artwork inserted successfully:", insertData)

      toast({
        title: "Artwork uploaded",
        description: "Your artwork has been successfully uploaded to the gallery.",
      })

      router.push("/artist-dashboard")
      router.refresh()
    } catch (error: any) {
      console.error("Error in upload process:", error)
      toast({
        title: "Error uploading artwork",
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
              {imagePreview ? (
                <div className="relative w-full max-w-md aspect-[3/4] mb-4 overflow-hidden rounded-md">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Artwork preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-full max-w-md aspect-[3/4] mb-4 flex items-center justify-center border-2 border-dashed rounded-md">
                  <div className="text-center p-6">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to upload or drag and drop your artwork image
                    </p>
                  </div>
                </div>
              )}

              <Label htmlFor="artworkImage" className="cursor-pointer">
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Upload className="h-4 w-4" />
                  <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
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
          Upload Artwork
        </Button>
      </div>
    </form>
  )
}

