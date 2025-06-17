"use client";
import React from 'react';
import Image from 'next/image';
import g1 from "./images/g1.png";
import g2 from "./images/g2.png";
import g3 from "./images/g3.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GallerySlider = () => {
    const images = [g1, g2, g3, g1, g2, g3, g1, g2, g3, g1, g2, g3];

    return (
        <div className="w-full h-max pb-5 mt-5 bg-white flex justify-center items-center">
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    901: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                    },
                }}
                className="w-full h-max pb-5"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex-shrink-0 w-[90%] h-[260px] md:h-[344px] mx-auto rounded-2xl overflow-hidden shadow-lg bg-[#FFF8E1] group transition-all duration-300">
                            <Image
                                src={img}
                                alt={`Gallery image ${index + 1}`}
                                width={350}
                                height={344}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default GallerySlider;