"use client";
import React, { useState, useMemo } from 'react';
import Nav1 from '@/app/components/Nav1/page';
import Image from 'next/image';
import key from "./images/key.svg";
import Link from 'next/link';
import Footer from '@/app/components/footer/page';
import Card from '@/app/components/Card/page';
import Loading from '@/app/components/loading/page';
import Cart from '@/app/components/Cart/page';

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
const ShopClient = ({ initialProducts = [], initialError }) => {
  // استخدم البيانات الجاية من السيرفر فقط
  const products = initialProducts;


if (!products || products.length === 0) {
  return (
    <div className="w-full min-h-[60vh] flex justify-center items-center bg-white">
      <Loading />
    </div>
  );
}
  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ["All Products", ...Array.from(new Set(cats))];
  }, [products]);

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p => p.inStock === true);
    }

    // Price filter
    if (selectedPrice === "Low to High") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.discountPrice > 0 ? a.discountPrice : a.price;
        const bPrice = b.discountPrice > 0 ? b.discountPrice : b.price;
        return aPrice - bPrice;
      });
    } else if (selectedPrice === "High to Low") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.discountPrice > 0 ? a.discountPrice : a.price;
        const bPrice = b.discountPrice > 0 ? b.discountPrice : b.price;
        return bPrice - aPrice;
      });
    } else if (selectedPrice === "Discount") {
      filtered = filtered.filter(p => p.discountPrice > 0);
    }

    return filtered;
  }, [products, selectedCategory, selectedPrice, inStockOnly]);



  return (
    <div>
      <Nav1 />
      <Cart />
      <section className='w-full h-max pb-5 pt-5 flex flex-col justify-center items-center bg-white max-[900px]:flex-wrap'>
        <div className='w-[70%] h-max rounded-[33px] bg-gradient-to-r from-[#FFFFFF] to-[#FFF6D4] shadow-[2px_2px_19px] flex justify-center items-center max-[900px]:w-full max-[900px]:flex-wrap '>
          <div className='w-[28%] h-[155px] flex justify-center pl-5 items-center max-[900px]:w-full max-[900px]:text-center max-[900px]:pl-0'>
            <h1 className='w-full h-max text-[26px] font-bold text-black max-[321px]:text-[20px]'>
              Buy More <span className='text-[#FFCF67]'>Save More Special Ra</span>tes for Bulk Orders
            </h1>
          </div>
          <div className='w-[40%] h-max pb-8 flex justify-center items-center max-[900px]:w-full'>
            <Image src={key} alt='key icon' priority />
          </div>
          <div className='w-[32%]  h-[155px] flex justify-center items-center max-[900px]:w-full'>
            <Link
              href="/pages/Business"
              className='w-[50%] h-[60px] rounded-[30px] text-[16px] flex justify-center items-center text-center font-semibold bg-[#FFCF67]'
            >
              Business
            </Link>
          </div>
        </div>
        <div className='w-[50%] h-max pb-5 pt-5 mt-5 rounded-[33px] bg-gradient-to-r from-[#FFFFFF] to-[#FFF6D4] shadow-[2px_2px_19px] flex justify-center items-center max-[900px]:w-full max-[900px]:flex-wrap max-[900px]:gap-5'>
          <div className='w-1/3 h-max  flex justify-center items-center max-[900px]:w-full'>
            {/* drop down for product category  */}
            <select
              className='w-[80%] p-2 rounded-[30px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]'
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option className="bg-white text-black font-semibold" key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className='w-1/3 h-max  flex justify-center items-center max-[900px]:w-full'>
            <h1 className='w-1/2 text-center text-[#FFCF67] font-medium text-[16px]'>Availability</h1>
            <input
              type="checkbox"
              className='w-[19px] h-[19px] accent-[#FFCF67] transition-all duration-200 focus:ring-2 focus:ring-[#FFCF67]'
              name="availability"
              id="in-stock"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
            />
            <label htmlFor="in-stock" className='text-[#A4A4A4] font-medium pl-2'>In Stock</label>
          </div>
          <div className='w-1/3 h-max  flex justify-center items-center max-[900px]:w-full'>
            {/* drop down for price filter with default value "Price" */}
            <select
              className='w-[80%] p-2 rounded-[30px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]'
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
            >
              <option value="" disabled hidden>Price</option>
              <option value="">Price</option>
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
              <option value="Discount">Discount</option>
            </select>
          </div>
        </div>
      </section>
      <section className='w-full h-max pb-5 pt-5 flex justify-center items-center flex-wrap gap-10 bg-white'>
        {initialError ? (
          <div className="text-lg text-red-500 font-semibold">Error loading products.</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-lg text-[#A4A4A4] font-semibold">No products found.</div>
        ) : (
          filteredProducts.map(product => (
            <Card
              key={product._id}
              id={product._id}
              image={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`}
              title={product.title}
              price={product.price}
              description={product.description}
              discountPrice={product.discountPrice}
              sizes={product.sizes}
              inStock={product.inStock}
              stock={product.stock}
            />
          ))
        )}
      </section>
      <Footer />
    </div>
  );
};

export default ShopClient;
