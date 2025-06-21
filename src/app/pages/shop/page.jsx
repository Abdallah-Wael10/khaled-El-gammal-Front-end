import ShopClient from "./ShopClient"

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