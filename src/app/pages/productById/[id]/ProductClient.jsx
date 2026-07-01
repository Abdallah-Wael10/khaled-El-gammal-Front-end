"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "@/app/components/loading/page";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/slices/cartSlice";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Card from "@/app/components/Card/page";
import Cart from "@/app/components/Cart/page";
import Image from "next/image";
import { useGetProductsQuery } from "@/app/features/Api/ProductApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  fadeIn,
  fadeUp,
  modalFadeScale,
  scaleTap,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/app/lib/motion";
import { getDiscountPercent, getSellingPrice, hasDiscount } from "@/app/utils/pricing";

const ProductClient = ({ id }) => {
  const { data: Products = [], isLoading: isLoadingProducts } = useGetProductsQuery();
  const dispatch = useDispatch();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;
    const fetchProductById = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${baseUrl}/api/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductById();
  }, [id, baseUrl]);

  useEffect(() => {
    if (!previewOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewOpen]);

  if (loading) return <Loading message="Loading product..." detail="Preparing product details" />;
  if (error) return <h1 className="mt-10 text-center text-red-500">{error}</h1>;
  if (!product) return null;

  const isOutOfStock = !product.inStock || Number(product.stock) === 0;
  const inStock = product.stock || 0;
  const productSizes = product?.sizes && product.sizes.length > 0 ? product.sizes : [];

  const imagesArr = [
    product.mainImage || product.image,
    ...(product.images || []).filter((img) => img !== (product.mainImage || product.image)),
  ];

  const openPreview = (src) => {
    setPreviewImg(src);
    setPreviewOpen(true);
  };

  const handleAddToCart = () => {
    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.price,
        mainImage: product.mainImage || product.image,
        quantity,
        size: selectedSize,
        discountPrice: product.discountPrice || 0,
      })
    );
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    dispatch({ type: "cart/clearCart" });
    dispatch(
      addToCart({
        id: product._id,
        title: product.title,
        price: product.price,
        mainImage: product.mainImage || product.image,
        quantity,
        size: selectedSize,
        discountPrice: product.discountPrice || 0,
      })
    );
    router.push("/pages/checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav1 />
      <Cart />

      <AnimatePresence>
        {previewOpen && previewImg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setPreviewOpen(false)}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} preview`}
          >
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#FFCF67] transition-all hover:bg-white/20"
              aria-label="Close product preview"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              className="relative flex max-h-[90vh] w-full max-w-6xl items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              variants={modalFadeScale}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Image
                src={previewImg}
                alt={`${product.title} preview`}
                width={1200}
                height={1200}
                className="max-h-[90vh] w-auto rounded-lg object-contain"
                quality={95}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        className="flex w-full flex-col items-center justify-center gap-10 py-10 md:flex-row"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex w-[95vw] flex-col items-center md:w-[45%]">
          <motion.button
            type="button"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 self-start rounded-lg border border-[#FFCF67] bg-white px-4 py-2 font-semibold text-[#FFCF67] transition-all duration-300 hover:bg-[#FFCF67] hover:text-white"
            {...scaleTap}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </motion.button>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            className="h-[340px] w-full overflow-hidden rounded-[18px] border border-[#00000026] bg-white shadow-xl md:h-[490px]"
            style={{ maxWidth: "100%" }}
          >
            {imagesArr.map((img, idx) => {
              const src = `${baseUrl}/uploads/${img}`;
              return (
                <SwiperSlide key={idx} className="flex items-center justify-center bg-white">
                  <Image
                    src={src}
                    width={700}
                    height={700}
                    alt={product.title}
                    className="h-[340px] w-full cursor-pointer object-contain transition-transform duration-300 hover:scale-105 md:h-[490px]"
                    priority={idx === 0}
                    quality={90}
                    onClick={() => openPreview(src)}
                    style={{ maxHeight: "100%", width: "auto", margin: "0 auto" }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
            {imagesArr.map((img, idx) => {
              const src = `${baseUrl}/uploads/${img}`;
              return (
                <button
                  key={idx}
                  type="button"
                  className={`rounded-lg border-2 bg-white p-1 transition-all duration-200 ${
                    idx === 0 ? "border-[#FFCF67]" : "border-gray-200 hover:border-[#FFCF67]"
                  }`}
                  onClick={() => openPreview(src)}
                  aria-label={`Preview thumbnail ${idx + 1}`}
                >
                  <Image
                    src={src}
                    alt={`thumb-${idx}`}
                    width={70}
                    height={70}
                    className="h-[60px] w-[60px] rounded-md object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full rounded-[18px] pb-5 pl-0 pt-4 md:w-[40%] md:pl-10">
          <h1 className="pb-2 text-[18px] font-bold uppercase tracking-widest text-[#A4A4A4] max-[768px]:text-center">
            KHALED EL GAMAL
          </h1>
          <h2 className="pb-2 text-[28px] font-extrabold text-[#FFCF67] max-[768px]:text-center">{product.title}</h2>

          <div className="flex items-center gap-3 pb-2 max-[900px]:flex-wrap max-[768px]:justify-center max-[768px]:text-center">
            {hasDiscount(product.discountPrice) ? (
              <>
                <span className="text-[22px] font-bold text-[#FFCF67]">
                  EGP {getSellingPrice(product.price, product.discountPrice)}
                </span>
                <span className="text-[16px] font-semibold text-red-500 line-through">EGP {product.price}</span>
                <span className="ml-2 rounded-lg bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                  {getDiscountPercent(product.price, product.discountPrice)}% OFF
                </span>
              </>
            ) : (
              <span className="text-[22px] font-bold text-[#FFCF67]">EGP {product.price}</span>
            )}
          </div>

          <p className="pb-2 text-[15px] font-medium text-[#BCBCBC] max-[768px]:text-center">
            {product.description || "No description available."}
          </p>

          <h2 className="pb-2 text-[14px] font-semibold text-[#A4A4A4] max-[768px]:text-center">
            {isOutOfStock ? (
              <span className="font-bold text-red-500">Out of Stock</span>
            ) : (
              `${inStock} items in stock`
            )}
          </h2>

          <div className="mb-4 flex items-center gap-4 max-[768px]:justify-center">
            <div className="flex items-center rounded-[8px] border border-[#00000014] bg-white px-2 py-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#FFCF67] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 text-[15px] text-black">{quantity}</span>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#FFCF67] text-[16px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => setQuantity((q) => Math.min(q + 1, inStock))}
                disabled={quantity >= inStock || isOutOfStock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {productSizes.length > 0 ? (
              <select
                className="rounded-[10px] border border-[#FFCF67] bg-white p-2 text-[16px] font-semibold text-[#FFCF67] shadow-sm focus:border-[#FFCF67] focus:outline-none focus:ring-2 focus:ring-[#FFCF67]"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={isOutOfStock}
                aria-label="Select size"
              >
                <option value="" disabled>
                  Size
                </option>
                {productSizes.map((size, idx) => (
                  <option key={idx} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-lg bg-[#F5F5F5] px-2 py-1 text-[15px] font-semibold text-[#A4A4A4]">
                No sizes available for this product
              </span>
            )}
          </div>

          <div className="mb-4 flex gap-4 max-[768px]:justify-center">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              className={`h-[42px] w-1/2 rounded-[12px] border border-[#00000033] bg-white text-[16px] font-semibold text-black transition-all duration-300 max-[768px]:w-[40%] ${
                isOutOfStock ? "cursor-not-allowed opacity-60" : "hover:shadow-[2px_2px_19px_#FFCF67]"
              }`}
              disabled={isOutOfStock}
              {...scaleTap}
            >
              Add to Cart
            </motion.button>
            <motion.button
              type="button"
              onClick={handleBuyNow}
              className={`h-[42px] w-1/2 rounded-[12px] bg-[#FFCF67] text-[16px] font-semibold text-white transition-all duration-300 max-[768px]:w-[40%] ${
                isOutOfStock ? "cursor-not-allowed opacity-60" : "hover:shadow-[2px_2px_19px_#FFCF67]"
              }`}
              disabled={isOutOfStock}
              {...scaleTap}
            >
              Buy Now
            </motion.button>
          </div>

          {isOutOfStock && (
            <div className="mb-4 text-center font-semibold text-red-500">
              This product is currently out of stock and cannot be purchased.
            </div>
          )}

          <details className="group w-full overflow-hidden rounded-2xl border border-amber-400 bg-white shadow-xl transition-all duration-300 hover:shadow-2xl max-[760px]:ml-5 max-[760px]:w-[90%] max-[1025px]:w-full">
            <summary className="flex cursor-pointer select-none items-center gap-3 rounded-t-2xl bg-white px-6 py-4 text-[14px] font-semibold text-black transition-all duration-200 hover:bg-amber-100 group-open:bg-amber-50">
              <svg
                className="h-5 w-5 text-amber-400 transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Shipping, Return & Refund Policies
            </summary>
            <div className="px-6 pb-6 pt-2 text-base leading-relaxed text-gray-600">
              <p className="mb-4">
                <span className="font-semibold text-amber-400">Shipping:</span> We deliver across Egypt within{" "}
                <span className="font-semibold">3-7 business days</span>. All items are securely packaged to ensure safe
                arrival.
              </p>
              <p className="mb-4">
                <span className="font-semibold text-amber-400">Returns:</span> If you are not satisfied with your
                purchase, you may return it within <span className="font-semibold">14 days</span> in its original
                condition for a full refund or exchange.
              </p>
              <p>
                <span className="font-semibold text-amber-400">Refunds:</span> Refunds are processed within{" "}
                <span className="font-semibold">5 business days</span> after we receive your returned item. For any
                questions, please contact our support team.
              </p>
            </div>
          </details>
        </div>
      </motion.section>

      <section className="flex w-full flex-col items-center justify-center bg-white pb-10 pt-10">
        <motion.div
          className="w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h1
            variants={staggerItem}
            className="pb-5 text-center text-[32px] font-medium text-[#FFCF67] md:text-[42px]"
          >
            Items you can&apos;t miss out on
          </motion.h1>
          <motion.div
            variants={staggerContainer}
            className="flex w-full flex-wrap items-center justify-center gap-6 pt-5"
          >
            {isLoadingProducts ? (
              <Loading variant="inline" message="Loading related items..." detail="Finding more handmade pieces" />
            ) : (
              Products.filter((p) => p._id !== product._id)
                .slice(0, 4)
                .map((prod) => (
                  <motion.div key={prod._id} variants={staggerItem}>
                    <Card
                      id={prod._id}
                      image={`${baseUrl}/uploads/${prod.mainImage}`}
                      title={prod.title}
                      price={prod.price}
                      description={prod.description}
                      discountPrice={prod.discountPrice}
                      inStock={prod.inStock}
                      stock={prod.stock}
                    />
                  </motion.div>
                ))
            )}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductClient;
