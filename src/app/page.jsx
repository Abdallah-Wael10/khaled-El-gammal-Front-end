"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Nav1 from "./components/Nav1/page";
import Footer from "./components/footer/page";
import Card from "./components/Card/page";
import GallerySlider from "./components/gallarySlider/page";
import Form from "./components/Form/page";
import facebook from "./images/facebook.svg";
import wp from "./images/wp.svg";
import insta from "./images/instaa.svg";
import map from "./images/mapp.svg";
import dogleft from "./images/dogleft.svg";
import dogright from "./images/dogright.svg";
import draw from "./images/draw.svg";
import Cart from "./components/Cart/page";
import { useGetProductsQuery } from "./features/Api/ProductApi";
import { fadeUp, pageReveal, scaleTap, staggerContainer, staggerItem, viewportOnce } from "@/app/lib/motion";
import { getProductImageCandidates } from "@/app/utils/productImages";

const socialLinks = [
  { href: "tel:+201159227861", icon: wp, label: "Call or WhatsApp" },
  { href: "https://www.instagram.com/khan_khaledelgamal?utm_source=qr", icon: insta, label: "Instagram" },
  { href: "https://www.instagram.com/khan_khaledelgamal?utm_source=qr", icon: facebook, label: "Facebook" },
  { href: "https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw", icon: map, label: "Location" },
];

function ProductCardSkeleton() {
  return (
    <div
      className="w-full max-w-xs animate-pulse overflow-hidden rounded-2xl border border-[#ead9a5] bg-white shadow-[0_10px_30px_rgba(43,34,1,0.08)]"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full bg-[#fff1bf]/60" />
      <div className="space-y-3 px-4 py-4">
        <div className="h-5 w-3/4 rounded bg-[#fff1bf]/70" />
        <div className="h-4 w-1/3 rounded bg-[#fff1bf]/50" />
        <div className="h-4 w-full rounded bg-[#fff1bf]/40" />
        <div className="h-4 w-5/6 rounded bg-[#fff1bf]/40" />
      </div>
    </div>
  );
}

export default function Home() {
  const { data: Products = [], isLoading: isLoadingProducts } = useGetProductsQuery();

  const randomProducts = useMemo(() => {
    if (!Products.length) return [];

    return [...Products]
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 4);
  }, [Products]);

  return (
    <main className="bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />

      <motion.section
        className="relative flex min-h-[calc(100dvh-80px)] w-full items-center justify-center overflow-hidden bg-home bg-cover bg-center bg-no-repeat px-4 py-20"
        variants={pageReveal}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/36 via-black/28 to-[#211900]/72" />
        <motion.div
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={staggerItem} className="mb-4 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] text-[#f8d77e] backdrop-blur-md">
            Handmade Egyptian Art
          </motion.p>
          <motion.h1 variants={staggerItem} className="text-4xl font-black tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
            KHALED EL GAMAL
          </motion.h1>
          <motion.h2 variants={staggerItem} className="mt-4 max-w-3xl text-xl font-bold leading-8 text-[#fff4c9] sm:text-3xl">
            The Power Of Creativity
          </motion.h2>
          <motion.div variants={staggerItem} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-black/26 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-[#d9a928]/26"
                aria-label={item.label}
                {...scaleTap}
              >
                <Image src={item.icon} alt="" width={22} height={22} aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        className="premium-section w-full overflow-hidden py-14"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-[0.65fr_1fr_0.65fr] lg:px-8">
          <div className="hidden justify-end lg:flex">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#d9a928]/20 blur-2xl" />
              <Image src={dogleft} alt="Egyptian craft illustration left" className="relative z-10" />
            </div>
          </div>
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Who we are</span>
            <h2 className="mt-3 text-3xl font-black text-[#211900] sm:text-5xl">
              KHA<span className="text-[#b88710]">LED EL G</span>AMAL
            </h2>
            <p className="mt-5 text-base font-medium leading-8 text-[#70664f]">
              Khaled El Gammal is a distinguished destination for the finest treasures of Khan El Khalili. Each piece reflects Egyptian heritage, artisanal mastery, and a deep commitment to handcrafted detail.
            </p>
          </div>
          <div className="hidden justify-start lg:flex">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#d9a928]/20 blur-2xl" />
              <Image src={dogright} alt="Egyptian craft illustration right" className="relative z-10" />
            </div>
          </div>
        </div>
      </motion.section>

      <section className="bg-white py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-5 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="flex w-full items-center justify-center gap-6"
          >
            <Image src={draw} alt="" className="hidden max-w-[260px] opacity-70 md:block" aria-hidden="true" priority />
            <div className="text-center">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Selected pieces</span>
              <h2 className="mt-3 text-3xl font-black text-[#b88710] sm:text-4xl">Trending Product</h2>
            </div>
            <Image src={draw} alt="" className="hidden max-w-[260px] -scale-x-100 opacity-70 lg:block" aria-hidden="true" priority />
          </motion.div>

          {isLoadingProducts ? (
            <div
              className="grid w-full grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-4"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
              <span className="sr-only">Loading trending products</span>
            </div>
          ) : (
            <motion.div
              key={randomProducts.map((product) => product._id).join("-") || "products-empty"}
              className="grid w-full grid-cols-1 justify-items-center gap-7 sm:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              whileInView="visible"
              viewport={viewportOnce}
            >
              {randomProducts.map((product) => (
                <motion.div key={product._id} variants={staggerItem} className="w-full max-w-xs">
                  <Card
                    id={product._id}
                    imageCandidates={getProductImageCandidates(product)}
                    title={product.title}
                    price={product.price}
                    description={product.description}
                    discountPrice={product.discountPrice}
                    inStock={product.inStock}
                    stock={product.stock}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} {...scaleTap}>
            <Link href="/pages/shop" className="premium-button inline-flex min-h-12 items-center justify-center px-8 text-sm">
              View Full Products
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="premium-section py-14">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Craft archive</span>
            <h2 className="mt-3 text-3xl font-black text-[#211900] sm:text-4xl">Gallery Collection</h2>
          </motion.div>
          <GallerySlider />
        </div>
      </section>

      <section className="bg-white flex justify-center items-center px-5 py-14">
        <Form />
      </section>
      <Footer />
    </main>
  );
}
