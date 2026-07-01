"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useGetGalleryQuery } from "@/app/features/Api/galleryApi";
import Loading from "../loading/page";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { fadeUp, scaleTap } from "@/app/lib/motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const GallerySlider = () => {
  const { data: images = [], isLoading } = useGetGalleryQuery();

  if (isLoading) {
    return <Loading variant="section" message="Loading gallery..." detail="Preparing featured images" />;
  }

  return (
    <motion.div
      className="flex w-full flex-col items-center bg-transparent py-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 16 },
          900: { slidesPerView: 3, spaceBetween: 20 },
          1200: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="w-full max-w-7xl"
      >
        {images.length === 0 && (
          <div className="py-10 text-center text-[#70664f]">No images found.</div>
        )}
        {images.map((img, index) => (
          <SwiperSlide key={img._id || index}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }} {...scaleTap}>
              <Link
                href="/pages/Gallery"
                className="group block overflow-hidden rounded-[22px] border border-[#ead9a5] bg-white shadow-[0_14px_40px_rgba(43,34,1,0.10)] transition-shadow duration-200 hover:shadow-[0_22px_55px_rgba(43,34,1,0.16)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.image}`}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.055]"
                    priority={index < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211900]/48 via-transparent to-transparent opacity-75 transition-opacity group-hover:opacity-50" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-4 py-2 text-sm font-bold text-[#6f5702] shadow-sm">
                    View Gallery
                  </span>
                </div>
              </Link>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <motion.div className="mt-8" {...scaleTap}>
        <Link href="/pages/Gallery" className="premium-button inline-flex min-h-12 items-center justify-center px-8 text-sm">
          View Full Gallery
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default GallerySlider;
