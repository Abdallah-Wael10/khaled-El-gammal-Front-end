"use client";

import React, { useState, useMemo } from "react";
import Nav1 from "@/app/components/Nav1/page";
import Image from "next/image";
import key from "./images/key.svg";
import Link from "next/link";
import Footer from "@/app/components/footer/page";
import Card from "@/app/components/Card/page";
import Loading from "@/app/components/loading/page";
import Cart from "@/app/components/Cart/page";
import { motion } from "motion/react";
import { fadeUp, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";
import { useGetCategoriesQuery } from "@/app/features/Api/CategoryApi";

import { getSellingPrice, hasDiscount } from "@/app/utils/pricing";

const ShopClient = ({ initialProducts = [], initialError }) => {
  const products = initialProducts;
  const { data: apiCategories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    const names = apiCategories.map((category) => category.name).filter(Boolean);
    return ["All Products", ...names];
  }, [apiCategories]);

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock === true);
    }

    if (selectedPrice === "Low to High") {
      filtered = filtered.sort((a, b) => {
        const aPrice = getSellingPrice(a.price, a.discountPrice);
        const bPrice = getSellingPrice(b.price, b.discountPrice);
        return aPrice - bPrice;
      });
    } else if (selectedPrice === "High to Low") {
      filtered = filtered.sort((a, b) => {
        const aPrice = getSellingPrice(a.price, a.discountPrice);
        const bPrice = getSellingPrice(b.price, b.discountPrice);
        return bPrice - aPrice;
      });
    } else if (selectedPrice === "Discount") {
      filtered = filtered.filter((p) => hasDiscount(p.discountPrice));
    }

    return filtered;
  }, [products, selectedCategory, selectedPrice, inStockOnly]);

  if (!products || (products.length === 0 && !initialError)) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-white">
        <Loading variant="section" message="Loading products..." detail="Preparing the collection" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />

      <section className="premium-section px-5 py-10 sm:py-14">
        <motion.div
          className="premium-surface mx-auto grid max-w-5xl items-center gap-6 rounded-[28px] p-5 sm:p-7 md:grid-cols-[1fr_1.1fr_auto]"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Bulk orders</span>
            <h1 className="mt-3 text-2xl font-black leading-tight text-[#211900] sm:text-3xl">
              Buy More, Save More Special Rates for Bulk Orders
            </h1>
          </div>
          <div className="flex justify-center">
            <Image src={key} alt="Gold key illustration" className="max-h-[160px] w-auto" priority />
          </div>
          <motion.div {...scaleTap}>
            <Link href="/pages/Business" className="premium-button inline-flex min-h-12 items-center justify-center px-7 text-sm">
              Business
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="premium-surface mx-auto mt-6 grid max-w-4xl gap-4 rounded-[24px] p-5 md:grid-cols-3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.08 }}
        >
          <label className="grid gap-2 text-sm font-bold text-[#6f5702]">
            Category
            <select
              className="premium-input w-full px-4 py-3 font-semibold"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <option value="All Products">Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option className="bg-white text-black" key={category} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
          </label>

          <label className="flex min-h-[76px] items-end gap-3 rounded-2xl border border-[#ead9a5] bg-[#fffdf8] px-4 py-3 text-sm font-bold text-[#6f5702]">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#b88710]"
              name="availability"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In Stock Only
          </label>

          <label className="grid gap-2 text-sm font-bold text-[#6f5702]">
            Price
            <select
              className="premium-input w-full px-4 py-3 font-semibold"
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
            >
              <option value="">Price</option>
              <option value="Low to High">Low to High</option>
              <option value="High to Low">High to Low</option>
              <option value="Discount">Discount</option>
            </select>
          </label>
        </motion.div>
      </section>

      <section className="bg-white px-5 py-12">
        <motion.div
          className="mx-auto grid max-w-7xl grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {initialError ? (
            <motion.div className="col-span-full rounded-2xl bg-red-50 px-6 py-5 text-center text-lg font-bold text-red-600" variants={staggerItem}>
              Error loading products.
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div className="col-span-full rounded-2xl border border-[#ead9a5] bg-[#fffaf0] px-6 py-8 text-center" variants={staggerItem}>
              <h2 className="text-lg font-black text-[#211900]">No products found</h2>
              <p className="mt-2 text-sm font-medium text-[#70664f]">Try changing the filters or viewing all products.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div key={product._id} variants={staggerItem} className="w-full max-w-xs">
                <Card
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
              </motion.div>
            ))
          )}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default ShopClient;
