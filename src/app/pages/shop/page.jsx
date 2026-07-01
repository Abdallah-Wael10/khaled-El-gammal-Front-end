import ShopClient from "./ShopClient"

export const metadata = {
  title: "Shop | Khaled El Gamal",
  description: "Shop unique handmade Egyptian products from Khaled El Gamal. Discover our latest collection.",
  keywords: "Shop, Khaled El Gamal, Handmade, Egyptian Art, Buy, Products",
  openGraph: {
    title: "Shop | Khaled El Gamal",
    description: "Shop unique handmade Egyptian products from Khaled El Gamal. Discover our latest collection.",
    url: "http://localhost:3000/pages/shop",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Shop Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const Shop = async () => {
  let products = [];
  let error = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    products = await res.json();
  } catch (err) {
    error = true;
  }

  return <ShopClient initialProducts={products} initialError={error} />;
};

export default Shop;
