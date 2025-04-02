"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Category {
  id: string
  name: string
}

interface Artist {
  id: string
  name: string
}

interface GalleryFiltersProps {
  categories: Category[]
  artists: Artist[]
}

export function GalleryFilters({ categories, artists }: GalleryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  const currentCategory = searchParams.get("category") || ""
  const currentArtist = searchParams.get("artist") || ""
  const currentSort = searchParams.get("sort") || "newest"

  const createQueryString = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key)
      } else {
        newSearchParams.set(key, value)
      }
    })

    return newSearchParams.toString()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(`/gallery?${createQueryString({ search: searchQuery || null, page: null })}`)
    })
  }

  const handleCategoryChange = (value: string) => {
    startTransition(() => {
      router.push(`/gallery?${createQueryString({ category: value || null, page: null })}`)
    })
  }

  const handleArtistChange = (value: string) => {
    startTransition(() => {
      router.push(`/gallery?${createQueryString({ artist: value || null, page: null })}`)
    })
  }

  const handleSortChange = (value: string) => {
    startTransition(() => {
      router.push(`/gallery?${createQueryString({ sort: value, page: null })}`)
    })
  }

  const handleReset = () => {
    setSearchQuery("")
    startTransition(() => {
      router.push("/gallery")
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search artworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isPending}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Select value={currentSort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currentCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter artworks by category, artist, and more.</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="sort">
                    <AccordionTrigger>Sort By</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={currentSort === "newest" ? "default" : "outline"}
                          onClick={() => handleSortChange("newest")}
                          className="justify-start"
                        >
                          Newest First
                        </Button>
                        <Button
                          variant={currentSort === "oldest" ? "default" : "outline"}
                          onClick={() => handleSortChange("oldest")}
                          className="justify-start"
                        >
                          Oldest First
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={currentCategory === "all" ? "default" : "outline"}
                          onClick={() => handleCategoryChange("all")}
                          className="justify-start"
                        >
                          All Categories
                        </Button>
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={currentCategory === category.name.toLowerCase() ? "default" : "outline"}
                            onClick={() => handleCategoryChange(category.name.toLowerCase())}
                            className="justify-start"
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="artist">
                    <AccordionTrigger>Artist</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={currentArtist === "" ? "default" : "outline"}
                          onClick={() => handleArtistChange("")}
                          className="justify-start"
                        >
                          All Artists
                        </Button>
                        {artists.map((artist) => (
                          <Button
                            key={artist.id}
                            variant={currentArtist === artist.name.toLowerCase() ? "default" : "outline"}
                            onClick={() => handleArtistChange(artist.name.toLowerCase())}
                            className="justify-start"
                          >
                            {artist.name}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
                <SheetTrigger asChild>
                  <Button>Apply Filters</Button>
                </SheetTrigger>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" size="icon" className="hidden md:flex" onClick={handleReset}>
            <Filter className="h-4 w-4" />
            <span className="sr-only">Reset filters</span>
          </Button>
        </div>
      </div>

      <div className="hidden md:flex flex-wrap gap-2">
        {searchParams.get("search") && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              startTransition(() => {
                router.push(`/gallery?${createQueryString({ search: null, page: null })}`)
              })
            }}
          >
            Search: {searchParams.get("search")}
            <span className="ml-1">×</span>
          </Button>
        )}
        {searchParams.get("category") && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              startTransition(() => {
                router.push(`/gallery?${createQueryString({ category: null, page: null })}`)
              })
            }}
          >
            Category: {searchParams.get("category")}
            <span className="ml-1">×</span>
          </Button>
        )}
        {searchParams.get("artist") && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              startTransition(() => {
                router.push(`/gallery?${createQueryString({ artist: null, page: null })}`)
              })
            }}
          >
            Artist: {searchParams.get("artist")}
            <span className="ml-1">×</span>
          </Button>
        )}
      </div>
    </div>
  )
}

