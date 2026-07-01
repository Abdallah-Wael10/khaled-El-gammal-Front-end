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
import { fadeIn, fadeUp, modalFadeScale, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

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
    dispatch(addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage || product.image,
      quantity,
      size: selectedSize,
      discountPrice: product.discountPrice || 0,
    }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (productSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    dispatch({ type: "cart/clearCart" });
    dispatch(addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      mainImage: product.mainImage || product.image,
      quantity,
      size: selectedSize,
      discountPrice: product.discountPrice || 0,
    }));
    router.push("/pages/checkout");
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />

      <AnimatePresence>
        {previewOpen && previewImg && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
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
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/20"
              aria-label="Close product preview"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              className="relative h-full max-h-[90vh] w-full max-w-6xl"
              onClick={(event) => event.stopPropagation()}
              variants={modalFadeScale}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Image src={previewImg} alt={`${product.title} preview`} fill className="object-contain" quality={95} priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="premium-section px-5 py-10 sm:py-14">
        <motion.div
          className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-col items-center" variants={staggerItem}>
            <motion.button
              type="button"
              onClick={() => router.back()}
              className="mb-5 self-start rounded-full border border-[#d9a928] bg-white px-5 py-3 text-sm font-bold text-[#6f5702] transition-colors hover:bg-[#fff1bf]"
              {...scaleTap}
            >
              Back to Shop
            </motion.button>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              className="h-[340px] w-full overflow-hidden rounded-[24px] border border-[#ead9a5] bg-white shadow-[0_18px_50px_rgba(43,34,1,0.12)] md:h-[520px]"
              style={{ maxWidth: "100%" }}
            >
              {imagesArr.map((img, idx) => {
                const src = `${baseUrl}/uploads/${img}`;
                return (
                  <SwiperSlide key={idx} className="flex items-center justify-center bg-white">
                    <button type="button" className="h-full w-full" onClick={() => openPreview(src)} aria-label={`Preview ${product.title} image ${idx + 1}`}>
                      <Image
                        src={src}
                        width={760}
                        height={760}
                        alt={product.title}
                        className="mx-auto h-full w-auto object-contain transition-transform duration-500 ease-out hover:scale-[1.035]"
                        priority={idx === 0}
                        quality={90}
                      />
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
              {imagesArr.map((img, idx) => {
                const src = `${baseUrl}/uploads/${img}`;
                return (
                  <motion.button
                    key={idx}
                    className={`rounded-xl border-2 bg-white p-1 transition-colors ${idx === 0 ? "border-[#d9a928]" : "border-[#ead9a5] hover:border-[#d9a928]"}`}
                    onClick={() => openPreview(src)}
                    type="button"
                    aria-label={`Preview thumbnail ${idx + 1}`}
                    {...scaleTap}
                  >
                    <Image src={src} alt={`Thumbnail ${idx + 1}`} width={72} height={72} className="h-[64px] w-[64px] rounded-lg object-cover" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div className="premium-surface rounded-[28px] p-6 sm:p-8" variants={fadeUp}>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Khaled El Gamal</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-[#211900] sm:text-4xl">{product.title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-3xl font-black text-[#b88710]">EGP {product.discountPrice}</span>
                  <span className="text-lg font-semibold text-red-500 line-through">EGP {product.price}</span>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    {Math.round(100 - (product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black text-[#b88710]">EGP {product.price}</span>
              )}
            </div>

            <p className="mt-5 text-base font-medium leading-8 text-[#70664f]">
              {product.description || "No description available."}
            </p>

            <div className="mt-5 rounded-2xl bg-[#fffaf0] px-4 py-3 text-sm font-bold">
              {isOutOfStock ? (
                <span className="text-red-600">Out of Stock</span>
              ) : (
                <span className="text-[#6f5702]">{inStock} items in stock</span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex min-h-12 items-center rounded-full border border-[#ead9a5] bg-white px-2">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1bf] text-base font-black text-[#6f5702] disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="min-w-10 px-3 text-center text-sm font-black">{quantity}</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1bf] text-base font-black text-[#6f5702] disabled:cursor-not-allowed disabled:opacity-45"
                  onClick={() => setQuantity((q) => Math.min(q + 1, inStock))}
                  disabled={quantity >= inStock || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {productSizes.length > 0 ? (
                <select
                  className="premium-input min-h-12 px-4 py-3 font-bold"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  disabled={isOutOfStock}
                  aria-label="Select size"
                >
                  <option value="" disabled>Size</option>
                  {productSizes.map((size, idx) => (
                    <option key={idx} value={size}>{size}</option>
                  ))}
                </select>
              ) : (
                <span className="rounded-full bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#70664f]">
                  No sizes available
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                className="min-h-12 rounded-full border border-[#d9a928] bg-white px-6 text-base font-bold text-[#6f5702] transition-colors hover:bg-[#fff1bf] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isOutOfStock}
                {...scaleTap}
              >
                Add to Cart
              </motion.button>
              <motion.button
                type="button"
                onClick={handleBuyNow}
                className="premium-button min-h-12 px-6 text-base disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isOutOfStock}
                {...scaleTap}
              >
                Buy Now
              </motion.button>
            </div>

            {isOutOfStock && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-center font-semibold text-red-600">
                This product is currently out of stock and cannot be purchased.
              </div>
            )}

            <details className="group mt-6 overflow-hidden rounded-2xl border border-[#ead9a5] bg-white">
              <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-sm font-bold text-[#211900] transition-colors hover:bg-[#fffaf0]">
                <svg className="h-5 w-5 text-[#b88710] transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Shipping, Return & Refund Policies
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-[#70664f]">
                <p className="mb-3">
                  <span className="font-bold text-[#b88710]">Shipping:</span> We deliver across Egypt within <span className="font-bold">3-7 business days</span>.
                </p>
                <p className="mb-3">
                  <span className="font-bold text-[#b88710]">Returns:</span> You may return eligible purchases within <span className="font-bold">14 days</span> in original condition.
                </p>
                <p>
                  <span className="font-bold text-[#b88710]">Refunds:</span> Refunds are processed within <span className="font-bold">5 business days</span> after receiving the returned item.
                </p>
              </div>
            </details>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-5 py-14">
        <motion.div
          className="mx-auto max-w-7xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          <motion.h2 variants={staggerItem} className="text-center text-3xl font-black text-[#b88710] sm:text-4xl">
            Items you cannot miss
          </motion.h2>
          <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingProducts ? (
              <Loading variant="inline" message="Loading related items..." detail="Finding more handmade pieces" />
            ) : (
              Products.filter((p) => p._id !== product._id).slice(0, 4).map((prod) => (
                <motion.div key={prod._id} variants={staggerItem} className="w-full max-w-xs">
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
