import React from "react";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import CustomizeForm from "@/app/components/CustomizeForm/page";
import Cart from "@/app/components/Cart/page";
import { MotionBlock } from "@/app/components/MotionShell";

export const metadata = {
  title: "Customize | Khaled El Gamal",
  description: "Customize your dream design with Khaled El Gamal. Share your vision and let us craft it for you.",
  keywords: "Customize, Custom Design, Handmade, Khaled El Gamal, Egyptian Art",
  openGraph: {
    title: "Customize | Khaled El Gamal",
    description: "Customize your dream design with Khaled El Gamal. Share your vision and let us craft it for you.",
    url: "http://localhost:3000/pages/Customize",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Customize Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const Customize = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <main className="flex-1">
        <section className="premium-section px-5 py-12 text-center sm:py-16">
          <MotionBlock viewport={false} className="mx-auto max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Custom work</span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#211900] sm:text-5xl">
              Customize Your Dream Design
            </h1>
            <p className="mt-5 text-base font-medium leading-8 text-[#70664f] sm:text-lg">
              Share your vision, upload inspiration images, and describe your custom piece. Our team will shape your ideas with careful craft and attention to detail.
            </p>
          </MotionBlock>
        </section>
        <section className="flex justify-center bg-white px-5 py-14">
          <CustomizeForm />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Customize;
