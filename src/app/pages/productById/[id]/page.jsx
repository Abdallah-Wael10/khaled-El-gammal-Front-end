"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "@/app/components/loading/page";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/slices/cartSlice";
import Nav1 from '@/app/components/Nav1/page';
import Footer from '@/app/components/footer/page';
import Card from '@/app/components/Card/page';
import Cart from "@/app/components/Cart/page";
import Image from "next/image";
import { useGetProductsQuery } from "@/app/features/Api/ProductApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

export async function generateMetadata({ params }) {
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
      url: `https://your-domain.com/pages/productById/${params.id}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: "product",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Khaled El Gamal`,
      description: product.description || "Discover unique handmade Egyptian art.",
      images: [`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`],
    },
  };
}

const ProductById = () => {
  const { data: Products = [], isLoading: isLoadingProducts } = useGetProductsQuery();
  const { id } = useParams();
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

  if (loading) return <Loading />;
  if (error) return <h1 className="text-red-500 text-center mt-10">{error}</h1>;
  if (!product) return null;

  // تحديد حالة المخزون
  const isOutOfStock = !product.inStock || Number(product.stock) === 0;
  const inStock = product.stock || 0;

  // بدل SizeFilter الثابتة استخدم المقاسات من المنتج نفسه
  const productSizes = product?.sizes && product.sizes.length > 0 ? product.sizes : [];

  // Images array: main image first, then the rest
  const imagesArr = [
    product.mainImage || product.image,
    ...(product.images || []).filter(img => img !== (product.mainImage || product.image))
  ];

  // Add to cart handler
  const handleAddToCart = () => {
    // لو فيه مقاسات لازم يختار، لو مفيش مقاسات عادي يضيف
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

  // Buy Now handler
  const handleBuyNow = () => {
    // لو فيه مقاسات لازم يختار، لو مفيش مقاسات عادي يضيف
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
    <div className="bg-white min-h-screen">
      <Nav1 />
      <Cart />
      <section className="w-full flex flex-col md:flex-row justify-center items-center gap-10 py-10">
        {/* Product Image & Gallery */}
        <div className="w-[95vw] md:w-[45%] flex flex-col items-center">
          {/* Swiper Slider */}
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
            className="w-full h-[340px] md:h-[490px] rounded-[18px] bg-white border border-[#00000026] shadow-xl overflow-hidden"
            style={{ maxWidth: "100%" }}
          >
            {imagesArr.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={`${baseUrl}/uploads/${img}`}
                  width={700}
                  height={700}
                  alt={product.title}
                  className="object-cover w-full h-[340px] md:h-[490px] cursor-pointer transition-transform duration-300 hover:scale-105 bg-white"
                  priority={idx === 0}
                  quality={100}
                  onClick={() => {
                    setPreviewImg(`${baseUrl}/uploads/${img}`);
                    setPreviewOpen(true);
                  }}
                  style={{ imageRendering: "auto" }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 w-full justify-center flex-wrap">
            {imagesArr.map((img, idx) => (
              <button
                key={idx}
                className={`border-2 rounded-lg p-1 bg-white transition-all duration-200 ${idx === 0 ? "border-[#FFCF67]" : "border-gray-200"} hover:border-[#FFCF67]`}
                onClick={() => {
                  setPreviewImg(`${baseUrl}/uploads/${img}`);
                  setPreviewOpen(true);
                }}
                type="button"
              >
                <Image
                  src={`${baseUrl}/uploads/${img}`}
                  alt={`thumb-${idx}`}
                  width={70}
                  height={70}
                  className="object-contain rounded-md max-h-[60px] max-w-[60px]"
                />
              </button>
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="w-full md:w-[40%] pb-5 pl-0 md:pl-10 pt-4 rounded-[18px]">
          <h1 className="pb-2 text-[18px] text-[#A4A4A4] font-bold uppercase tracking-widest max-[768px]:text-center">KHALED EL GAMAL</h1>
          <h2 className="pb-2 text-[28px] text-[#FFCF67] font-extrabold max-[768px]:text-center">{product.title}</h2>
          {/* Price & Discount */}
          <div className="flex items-center gap-3 pb-2 max-[768px]:text-center max-[768px]:justify-center max-[900px]:flex-wrap ">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-[22px] text-[#FFCF67] font-bold ">
                  EGP {product.discountPrice}
                </span>
                <span className="text-[16px] text-red-500 font-semibold line-through ">
                  EGP {product.price}
                </span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold ">
                  {Math.round(100 - (product.discountPrice / product.price) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-[22px] text-[#FFCF67] font-bold ">
                EGP {product.price}
              </span>
            )}
          </div>
          <p className="pb-2 text-[15px] text-[#BCBCBC] font-medium max-[768px]:text-center ">{product.description || "No description available."}</p>
          <h2 className="pb-2 text-[14px] text-[#A4A4A4] font-semibold max-[768px]:text-center">
            {isOutOfStock ? (
              <span className="text-red-500 font-bold   ">Out of Stock</span>
            ) : (
              `${inStock} items in stock`
            )}
          </h2>
          {/* Quantity & Size */}
          <div className="flex gap-4 items-center mb-4 max-[768px]:justify-center">
            <div className="flex items-center border border-[#00000014] rounded-[8px] bg-white px-2 py-1">
              <button
                className="w-7 h-7 flex justify-center items-center rounded-[10px] text-[16px] bg-[#FFCF67] text-white font-semibold"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >-</button>
              <span className="px-3 text-[15px] text-black">{quantity}</span>
              <button
                className="w-7 h-7 flex justify-center items-center rounded-[10px] text-[16px] bg-[#FFCF67] text-white font-semibold"
                onClick={() => setQuantity(q => Math.min(q + 1, inStock))}
                disabled={quantity >= inStock || isOutOfStock}
              >+</button>
            </div>
            {productSizes.length > 0 ? (
              <select
                className="p-2 rounded-[10px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]"
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                disabled={isOutOfStock}
              >
                <option value="" disabled>Size</option>
                {productSizes.map((size, idx) => (
                  <option key={idx} value={size}>{size}</option>
                ))}
              </select>
            ) : (
              <span className="text-[#A4A4A4] text-[15px] font-semibold px-2 py-1 bg-[#F5F5F5] rounded-lg">
                No sizes available for this product
              </span>
            )}
          </div>
          {/* Add to Cart & Buy Now */}
          <div className="flex gap-4 mb-4 max-[768px]:justify-center">
            <button
              onClick={handleAddToCart}
              className={`w-1/2 h-[42px] text-[16px] font-semibold bg-white border rounded-[12px] border-[#00000033] text-black transition-all duration-300 active:scale-95 max-[768px]:w-[40%] ${isOutOfStock ? "opacity-60 cursor-not-allowed" : "hover:shadow-[2px_2px_19px_#FFCF67]"}`}
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className={`w-1/2 h-[42px] rounded-[12px] text-[16px] font-semibold bg-[#FFCF67] text-white transition-all duration-300 active:scale-95 max-[768px]:w-[40%] ${isOutOfStock ? "opacity-60 cursor-not-allowed" : "hover:shadow-[2px_2px_19px_#FFCF67]"}`}
              disabled={isOutOfStock}
            >
              Buy Now
            </button>
          </div>
          {/* رسالة توضيحية لو المنتج Out of Stock */}
          {isOutOfStock && (
            <div className="mb-4 text-red-500 font-semibold text-center">
              This product is currently out of stock and cannot be purchased.
            </div>
          )}
          {/* Accordion for Shipping, Return & Refund Policies */}
          <details className="group w-full   max-[760px]:w-[90%] max-[760px]:ml-5 max-[1025px]:w-full   border border-amber-400 rounded-2xl bg-white shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ">
            <summary className="flex items-center gap-3 cursor-pointer px-6 py-4 text-[14px] font-semibold text-black select-none bg-white group-open:bg-amber-50 rounded-t-2xl transition-all duration-200 hover:bg-amber-100">
              <svg className="w-5 h-5 text-amber-400 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Shipping, Return & Refund Policies
            </summary>
            <div className="px-6 pt-2 pb-6 text-base text-gray-600 leading-relaxed">
              <p className="mb-4">
                <span className="font-semibold text-amber-400">Shipping:</span> We deliver across Egypt within <span className="font-semibold">3-7 business days</span>. All items are securely packaged to ensure safe arrival.
              </p>
              <p className="mb-4">
                <span className="font-semibold text-amber-400">Returns:</span> If you are not satisfied with your purchase, you may return it within <span className="font-semibold">14 days</span> in its original condition for a full refund or exchange.
              </p>
              <p>
                <span className="font-semibold text-amber-400">Refunds:</span> Refunds are processed within <span className="font-semibold">5 business days</span> after we receive your returned item. For any questions, please contact our support team.
              </p>
            </div>
          </details>
        </div>
      </section>
      {/* Related Items */}
      <section className="w-full pb-10 pt-10 flex flex-col justify-center items-center bg-white">
        <h1 className="pb-5 text-center text-[32px] md:text-[42px] text-[#FFCF67] font-medium">Items you can't miss out on</h1>
        <div className="w-full flex pt-5 justify-center items-center gap-6 flex-wrap">
          {isLoadingProducts ? (
            <Loading />
          ) : Products.filter(p => p._id !== product._id).slice(0, 4).map((prod) => (
            <Card
              key={prod._id}
              id={prod._id}
              image={`${baseUrl}/uploads/${prod.mainImage}`}
              title={prod.title}
              price={prod.price}
              description={prod.description}
              discountPrice={prod.discountPrice}
              inStock={prod.inStock}
              stock={prod.stock}
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductById;
