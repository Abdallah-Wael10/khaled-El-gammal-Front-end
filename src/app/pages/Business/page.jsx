import React from "react";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Image from "next/image";
import Svg from "./images/own.svg";
import dollar from "./images/dollar.svg";
import setting from "./images/setting.svg";
import support from "./images/support.svg";
import quality from "./images/quality.svg";
import BusinessForm from "@/app/components/BusinessForm/page";
import Cart from "@/app/components/Cart/page";
import { MotionBlock, MotionItem, MotionList } from "@/app/components/MotionShell";

export const metadata = {
  title: "Business | Khaled El Gamal",
  description: "Special rates and offers for business owners. Partner with Khaled El Gamal for unique handmade products.",
  keywords: "Business, Wholesale, Special Rates, Khaled El Gamal, Handmade, Partnership",
  openGraph: {
    title: "Business | Khaled El Gamal",
    description: "Special rates and offers for business owners. Partner with Khaled El Gamal for unique handmade products.",
    url: "http://localhost:3000/pages/Business",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Business Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const benefits = [
  { icon: dollar, text: "Special prices for business owners" },
  { icon: setting, text: "Product customization options" },
  { icon: quality, text: "High-quality craftsmanship" },
  { icon: support, text: "Dedicated support and delivery" },
];

const Business = () => {
  return (
    <main className="bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <section className="premium-section px-5 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <MotionBlock className="text-center lg:text-left" viewport={false}>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Wholesale and partnership</span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#211900] sm:text-5xl">
              Do you own a store or business?
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#70664f] sm:text-lg lg:mx-0">
              Get handmade products, special pricing, reliable delivery, and guaranteed quality for your business.
            </p>
          </MotionBlock>
          <MotionBlock className="flex justify-center" viewport={false} delay={0.08}>
            <Image src={Svg} alt="Business owner illustration" className="w-full max-w-[420px]" priority />
          </MotionBlock>
        </div>
      </section>

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <MotionBlock className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Why buy from us</span>
            <h2 className="mt-3 text-3xl font-black text-[#211900] sm:text-4xl">
              Partner with <span className="text-[#b88710]">Khaled El Gamal</span>
            </h2>
          </MotionBlock>
          <MotionList className="mt-10 grid gap-5 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <MotionItem key={benefit.text} className="premium-surface flex min-h-[104px] items-center gap-5 rounded-[22px] p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fff1bf]">
                  <Image src={benefit.icon} alt="" className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold leading-6 text-[#211900] sm:text-lg">{benefit.text}</h3>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      <section className="premium-section flex justify-center px-5 py-14">
        <BusinessForm />
      </section>
      <Footer />
    </main>
  );
};

export default Business;
