# Online Art Gallery

A modern web application that showcases and promotes various artworks, allowing artists to exhibit their creations and art enthusiasts to explore and purchase artworks online.

## 🎨 Features

- **User Authentication**: Secure login and registration system with OAuth options
- **Artist Profiles**: Dedicated profiles for artists to showcase their work and bio
- **Artwork Gallery**: Browse and filter artworks by category, artist, and more
- **Artwork Details**: View detailed information about each artwork
- **Artist Dashboard**: For artists to manage their uploaded artworks
- **Favorites System**: Users can save their favorite artworks
- **Responsive Design**: Fully responsive interface that works on all devices

## 🚀 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Image Storage**: Base64 encoding for images
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/suryaakkala/Art-Gallery.git
   cd Art-Gallery
   ```

2. Install dependencies:

```shellscript
npm install
```


3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```


4. Run the development server:

```shellscript
npm run dev
```


5. Open [localhost:3000](http://localhost:3000) in your browser to see the application.


## 📊 Database Schema

The application uses the following main tables:

- **artists**: Stores artist profiles
- **artworks**: Stores artwork information
- **categories**: Stores artwork categories
- **user_favorites**: Tracks user's favorite artworks


## 🔐 Authentication

The application uses Supabase Authentication with:

- Email/password login
- OAuth providers (Google, Facebook)
- Role-based access control for artists


## 📱 Key Pages

- **Home**: Featured artworks and categories
- **Gallery**: Browse all artworks with filtering options
- **Artists**: Browse all artists
- **Artist Profile**: View an artist's profile and artworks
- **Artwork Details**: View detailed information about an artwork
- **Artist Dashboard**: For artists to manage their artworks
- **Profile**: User profile management


## 🧩 Components

The application includes reusable components like:

- Artwork cards and grids
- Artist profiles
- Navigation components
- Form components
- Authentication forms


## 📝 Image Handling

The application uses base64 encoding for image storage, with:

- Client-side conversion for small images
- Server-side API for larger images
- Fallback to placeholder images when needed


## 🚀 Deployment

The application can be deployed to Vercel with the following steps:

1. Create a Vercel account if you don't have one
2. Connect your GitHub repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy the application

## 🌐 Live Deployment

You can access the live version of the application at:
[Surya Akkala's Art Gallery](https://suryaakkala-art-gallery.vercel.app/).

## 🔧 Configuration

The application uses the following configuration files:

- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration


## 📁 Project Structure

```plaintext
Art-Gallery/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── artist-dashboard/ # Artist dashboard pages
│   ├── artists/          # Artist listing and profiles
│   ├── auth/             # Authentication pages
│   ├── gallery/          # Gallery pages
│   ├── profile/          # User profile pages
│   └── ...               # Other pages
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Other components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and types
│   ├── supabase/         # Supabase client
│   └── ...               # Other utilities
├── public/               # Static assets
└── styles/               # Global styles
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

- [Harsha Sri](https://github.com/DHarshasri1411)
- [Sruthi Kanneti](https://github.com/Sruthi-3-0)
- [Surya Akkala](https://github.com/suryaakkala)


## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)


```plaintext
This README provides a comprehensive overview of your Online Art Gallery project, including its features, tech stack, installation instructions, project structure, and key components. It's designed to help users understand what your project does and how to get started with it.
```