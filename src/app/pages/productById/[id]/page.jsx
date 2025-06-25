import ProductClient from "./ProductClient";

export async function generateMetadata(props) {
  let params = props.params;
  if (typeof params.then === "function") {
    params = await params;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${params.id}`, { cache: "no-store" });
  if (!res.ok) {
    return {
      title: "Product Not Found | Khaled El Gamal",
      description: "This product does not exist.",
    };
  }
  const product = await res.json();
  return {
    title: `${product.title} | Khaled El Gamal`,
    description: product.description || "Discover unique handmade Egyptian art.",
    openGraph: {
      title: `${product.title} | Khaled El Gamal`,
      description: product.description || "Discover unique handmade Egyptian art.",
      url: `http://localhost:3000/pages/productById/${params.id}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Khaled El Gamal`,
      description: product.description || "Discover unique handmade Egyptian art.",
      images: [`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`],
    },
  };
}

// هنا خلي الكومبوننت async واعمل await للـ params
const ProductById = async ({ params }) => {
  if (typeof params.then === "function") {
    params = await params;
  }
  return <ProductClient id={params.id} />;
};

export default ProductById;