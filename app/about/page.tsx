import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About | Online Art Gallery",
  description: "Learn about our mission to connect artists with art enthusiasts and promote art appreciation.",
}

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Our Gallery</h1>

        <div className="relative aspect-video mb-8 overflow-hidden rounded-lg">
          <Image src="/about.png" alt="Online Art Gallery" fill className="object-cover" />
        </div>

        <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert">
          <p className="text-justify">
            Welcome to our Online Art Gallery, a virtual space dedicated to showcasing and promoting various artworks
            from talented artists around the world. Our platform serves as a bridge connecting artists with art
            enthusiasts, providing a curated collection of paintings, sculptures, photographs, digital art, and other
            forms of visual art.
            
          </p>

          <h2><b>Our Mission</b>:</h2>
          <p className="text-justify">
            Our mission is to democratize art appreciation and provide a platform where artists can exhibit their
            creations to a global audience. We believe that art should be accessible to everyone, and our online gallery
            breaks down geographical barriers, allowing art lovers from anywhere in the world to discover and connect
            with artists they might never have encountered otherwise.

          </p>

          <h2><b>For Artists</b>:</h2>
          <p className="text-justify">
            For artists, our platform offers a unique opportunity to showcase their work to a diverse audience. We
            provide tools for artists to create professional profiles, upload high-quality images of their artworks, and
            connect with potential admirers and collectors. Our goal is to help artists gain visibility and recognition
            for their creative endeavors.

          </p>

          <h2><b>For Art Enthusiasts</b>:</h2>
          <p className="text-justify">
            For art enthusiasts, our gallery offers a curated selection of artworks across various styles, mediums, and
            price points. Whether you're a seasoned collector or someone who simply appreciates beautiful art, our
            platform allows you to discover new artists, explore different art forms, and find pieces that resonate with
            your personal taste.

          </p>

          <h2><b>Our Vision</b>: </h2>
          <p className="text-justify">
            We envision a world where art is more accessible, where artists have greater opportunities to share their
            work, and where art enthusiasts can easily discover and connect with artists whose work speaks to them.
            Through our online gallery, we aim to foster a vibrant community of artists and art lovers, united by their
            passion for visual expression.
          </p>

          <p className="text-justify">

            Thank you for visiting our Online Art Gallery. We invite you to explore our collection, connect with our
            artists, and join us in celebrating the power and beauty of art.
          </p>
        </div>
      </div>
    </div>
  )
}

