import GalleryClient from './GalleryClient';

export const metadata = {
  title: "Gallery | Khaled El Gamal",
  description: "Explore the gallery collection of Khaled El Gamal. Unique handmade Egyptian art and decor.",
  keywords: "Gallery, Khaled El Gamal, Handmade, Egyptian Art, Decor",
  openGraph: {
    title: "Gallery | Khaled El Gamal",
    description: "Explore the gallery collection of Khaled El Gamal. Unique handmade Egyptian art and decor.",
    url: "http://localhost:3000/pages/Gallery",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Gallery Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const Gallery = async () => {
  let gallery = [];
  let error = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    gallery = await res.json();
  } catch (err) {
    error = true;
  }

  return <GalleryClient initialGallery={gallery} initialError={error} />;
};

export default Gallery;
