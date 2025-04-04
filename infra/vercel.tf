resource "vercel_project" "art_gallery" {
  name      = "art-gallery"
  framework = "nextjs"
  git_repository = {
    type = "github"
    repo = "suryaakkala/Art-Gallery"
  }
  environment = [
    {
      key   = "NEXT_PUBLIC_SUPABASE_URL"
      value = var.NEXT_PUBLIC_SUPABASE_URL
      target = ["production", "preview"]
    },
    {
      key   = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
      value = var.NEXT_PUBLIC_SUPABASE_ANON_KEY
      target = ["production", "preview"]
    }
  ]
}
