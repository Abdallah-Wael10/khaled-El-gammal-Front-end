"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetGalleryQuery } from '@/app/features/Api/galleryApi';
import Loading from '../loading/page';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GallerySlider = () => {
  const { data: images = [], isLoading } = useGetGalleryQuery();

  if (isLoading) return <Loading />;

  return (
    <div className="w-full py-8 bg-white flex flex-col items-center">
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
          <div className="text-center text-gray-400 py-10">No images found.</div>
        )}
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Link
              href="/pages/Gallery"
              className="block group rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition-all duration-300 border border-[#FFCF67]/30"
            >
              <div className="relative w-full h-[220px] md:h-[320px]">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img.image}`}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  priority={index < 4}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition" />
              </div>

            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <Link
        href="/pages/Gallery"
        className="mt-8 px-8 py-3 bg-[#FFCF67] text-white font-bold rounded-full shadow hover:bg-[#e6b94e] transition"
      >
        View Full Gallery
      </Link>
    </div>
  );
};

export default GallerySlider;

