"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"
import { Loader2, Upload } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Artist {
  id: string
  name: string
  bio: string | null
  profile_image_url: string | null
  website_url: string | null
}

interface ProfileFormProps {
  user: User
  artistProfile: Artist | null
}

export function ProfileForm({ user, artistProfile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [fullName, setFullName] = useState(user.user_metadata.full_name || "")
  const [email, setEmail] = useState(user.email || "")
  const [artistName, setArtistName] = useState(artistProfile?.name || "")
  const [bio, setBio] = useState(artistProfile?.bio || "")
  const [websiteUrl, setWebsiteUrl] = useState(artistProfile?.website_url || "")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    artistProfile?.profile_image_url || null,
  )

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setProfileImagePreview(reader.result as string)
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user metadata
      const { error: userUpdateError } = await supabase.auth.updateUser({
        email: email !== user.email ? email : undefined,
        data: { full_name: fullName },
      })

      if (userUpdateError) {
        console.error("User update error:", userUpdateError)
        throw userUpdateError
      }

      // If user is an artist, update artist profile
      if (artistProfile && user.user_metadata.is_artist) {
        let profileImageUrl = artistProfile.profile_image_url

        // Upload profile image if changed
        if (profileImage) {
          try {
            // Try to upload via server API or direct base64
            profileImageUrl = await uploadImageToServer(profileImage)
            console.log("Profile image processed successfully")
          } catch (uploadError) {
            console.error("Failed to process image, keeping existing:", uploadError)

            // Keep existing image URL
            toast({
              title: "Image processing failed",
              description: "We couldn't update your profile image, but saved the other changes.",
              variant: "warning",
            })
          }
        }

        // Update artist profile
        const { error: artistUpdateError } = await supabase
          .from("artists")
          .update({
            name: artistName,
            bio,
            website_url: websiteUrl,
            profile_image_url: profileImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", artistProfile.id)

        if (artistUpdateError) {
          console.error("Artist profile update error:", artistUpdateError)
          throw artistUpdateError
        }
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Error updating profile",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        {user.user_metadata.is_artist && <TabsTrigger value="artist">Artist Profile</TabsTrigger>}
      </TabsList>

      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details and personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                {email !== user.email && (
                  <p className="text-xs text-muted-foreground">
                    Changing your email will require verification of the new address.
                  </p>
                )}
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Account
                </Button>
              </div>
            </form>
          </CardContent>
          <Separator />
          <CardFooter className="flex flex-col items-start pt-6">
            <h3 className="text-lg font-medium">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all of your data.</p>
            <Button variant="destructive">Delete Account</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {user.user_metadata.is_artist && (
        <TabsContent value="artist">
          <Card>
            <CardHeader>
              <CardTitle>Artist Profile</CardTitle>
              <CardDescription>Update your public artist profile information.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-32 w-32 overflow-hidden rounded-full">
                      {profileImagePreview ? (
                        <Image
                          src={profileImagePreview || "/placeholder.svg"}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Avatar className="h-32 w-32">
                          <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <Label htmlFor="profileImage" className="cursor-pointer">
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Upload className="h-4 w-4" />
                        <span>Change Photo</span>
                      </div>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageChange}
                        disabled={isLoading}
                      />
                    </Label>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="artistName">Artist Name</Label>
                      <Input
                        id="artistName"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL (optional)</Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your art..."
                    className="min-h-[150px]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Artist Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

