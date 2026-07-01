"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGetGalleryQuery } from "@/app/features/Api/galleryApi";
import Loading from "@/app/components/loading/page";
import Nav1 from "@/app/components/Nav1/page";
import Image from "next/image";
import Footer from "@/app/components/footer/page";
import Cart from "@/app/components/Cart/page";
import { fadeIn, fadeUp, modalFadeScale, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

const GalleryClient = ({ initialGallery, initialError }) => {
  const [forceFetch, setForceFetch] = useState(false);

  const { data, isLoading, error, isFetching } = useGetGalleryQuery(undefined, {
    skip: !!initialGallery && !forceFetch,
  });

  const galleryData = data || initialGallery;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = (img, title) => {
    setModalImg(img);
    setModalTitle(title || "Gallery image");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (!modalOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  if ((isLoading || isFetching) && !galleryData) {
    return <Loading message="Loading gallery..." detail="Preparing the craft archive" />;
  }
  if ((error || initialError) && !galleryData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fffaf0] px-5 text-center">
        <p className="mb-4 text-2xl font-black text-[#b88710]">Check your internet and try again</p>
        <button
          type="button"
          onClick={() => setForceFetch(true)}
          className="premium-button inline-flex min-h-11 items-center justify-center px-6"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!galleryData || galleryData.length === 0) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center bg-white">
        <Loading variant="section" message="Loading gallery..." detail="Preparing the craft archive" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <section className="premium-section px-5 py-12 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Craft archive</span>
          <h1 className="mt-3 text-4xl font-black text-[#b88710] sm:text-5xl">Gallery Collection</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#70664f] sm:text-lg">
            Explore our collection of handmade Egyptian pieces, materials, finishes, and craft details.
          </p>
        </motion.div>
      </section>

      <section className="flex-1 bg-white px-5 py-12">
        <motion.div
          className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {galleryData.map((item, index) => {
            const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`;
            return (
              <motion.button
                type="button"
                key={item._id}
                className="group overflow-hidden rounded-[22px] border border-[#ead9a5] bg-white text-left shadow-[0_14px_40px_rgba(43,34,1,0.10)] transition-shadow hover:shadow-[0_22px_55px_rgba(43,34,1,0.16)]"
                onClick={() => openModal(imageUrl, item.title)}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                {...scaleTap}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#fffaf0]">
                  <Image
                    src={imageUrl}
                    alt={item.title || `Gallery item ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.055]"
                    draggable={false}
                    priority={index < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211900]/58 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-45" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-4 py-2 text-sm font-bold text-[#6f5702] shadow-sm">
                    View
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      <AnimatePresence onExitComplete={() => setModalImg(null)}>
        {modalOpen && modalImg && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={closeModal}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="dialog"
            aria-modal="true"
            aria-label={modalTitle}
          >
            <button
              type="button"
              className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/12 text-3xl leading-none text-white transition-colors hover:bg-white/20"
              onClick={closeModal}
              aria-label="Close gallery preview"
            >
              &times;
            </button>
            <motion.div
              className="relative h-full max-h-[90vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
              variants={modalFadeScale}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Image src={modalImg} alt={modalTitle} fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default GalleryClient;
