import GalleryClient from './GalleryClient';

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