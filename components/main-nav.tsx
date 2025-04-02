"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/gallery"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/gallery" || pathname.startsWith("/gallery/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Gallery
      </Link>
      <Link
        href="/artists"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/artists" || pathname.startsWith("/artists/") ? "text-primary" : "text-muted-foreground",
        )}
      >
        Artists
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/about" ? "text-primary" : "text-muted-foreground",
        )}
      >
        About
      </Link>
    </nav>
  )
}

