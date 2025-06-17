"use client";
import React, { useState } from 'react';
import { useGetGalleryQuery } from '@/app/features/Api/galleryApi';
import Loading from '@/app/components/loading/page';
import Nav1 from '@/app/components/Nav1/page';
import Image from 'next/image';
import Footer from '@/app/components/footer/page';

const GalleryClient = ({ initialGallery, initialError }) => {
  const [forceFetch, setForceFetch] = useState(false);

  // skip فقط أول مرة لو عندك initialGallery ولم يحصل forceFetch
  const { data, isLoading, error, isFetching } = useGetGalleryQuery(undefined, {
    skip: !!initialGallery && !forceFetch,
  });

  const galleryData = data || initialGallery;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);

  const openModal = (img) => {
    setModalImg(img);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  if ((isLoading || isFetching) && !galleryData) return <Loading />;
  if ((error || initialError) && !galleryData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#FFF8E1]">
        <p className="text-2xl font-bold text-[#FFCF67] mb-4">Check your internet and try again</p>
        <button
          onClick={() => setForceFetch(true)}
          className="px-6 py-2 rounded-full bg-[#FFCF67] text-white font-semibold shadow hover:bg-yellow-400 transition"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FFF8E1] min-h-screen flex flex-col">
      <Nav1 />
      <section className="w-full pt-10 pb-5 flex flex-col items-center bg-white">
        <h1 className="text-[35px] text-[#FFCF67] font-extrabold text-center mb-2 tracking-tight">
          Gallery Collection
        </h1>
        <p className="text-[23px] font-normal text-[#919191] text-center mb-2">
          Explore our exquisite collection of handmade products.
        </p>
      </section>
      <section className="w-full flex-1 pb-10 bg-white flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl px-4">
          {galleryData.map((item, index) => (
            <div
              key={item._id}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-[#FFF8E1] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
              onClick={() => openModal(`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`)}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                alt={item.title}
                width={400}
                height={320}
                className="object-cover w-full h-[260px] md:h-[320px] transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:brightness-110"
                draggable={false}
                priority={index === 0}
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-[#FFCF67]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="px-5 py-2 rounded-full bg-[#FFCF67] text-white text-sm font-semibold shadow-lg backdrop-blur">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Fullscreen Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-all duration-300"
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-8 text-white bg-[#FFCF67] hover:bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center text-3xl font-bold shadow-lg transition"
            onClick={closeModal}
            aria-label="Close"
            style={{ zIndex: 60 }}
          >
            &times;
          </button>
          <Image
            src={modalImg}
            alt="Large Gallery"
            fill
            className="object-contain w-full h-full"
            priority
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default GalleryClient;