import React from "react";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Cart from "@/app/components/Cart/page";
import { MotionBlock, MotionItem, MotionList } from "@/app/components/MotionShell";

export const metadata = {
  title: "About Us | Khaled El Gamal",
  description: "Learn about Khaled El Gamal's journey, values, and commitment to authentic Egyptian craftsmanship.",
  keywords: "About Khaled El Gamal, Egyptian Artisans, Handmade, Khan El Khalili",
  openGraph: {
    title: "About Us | Khaled El Gamal",
    description: "Learn about Khaled El Gamal's journey, values, and commitment to authentic Egyptian craftsmanship.",
    url: "http://localhost:3000/pages/AboutUs",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "About Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const collections = [
  "Framed Earthenware",
  "Stone Boxes",
  "Stone-Inlaid Tables",
  "Handmade Chess Sets",
];

const values = [
  "Inspired by Khan El Khalili",
  "100% Handmade by Artisans",
  "Exceptional Craftsmanship",
  "Unique Art for Your Space",
];

const AboutUs = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <main className="flex-1">
        <section className="premium-section px-5 py-16 text-center">
          <MotionBlock viewport={false} className="mx-auto max-w-4xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Our story</span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#211900] sm:text-6xl">
              Khaled El Gamal
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-8 text-[#70664f] sm:text-lg">
              Nestled in the vibrant heart of El Moez Street, Khaled El Gamal has celebrated over 20 years of authentic Egyptian craftsmanship, transforming heritage into handmade art.
            </p>
          </MotionBlock>
        </section>

        <section className="bg-white px-5 py-14">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
            <MotionBlock className="rounded-[28px] border border-[#ead9a5] bg-[#fffaf0] p-7">
              <h2 className="text-2xl font-black text-[#b88710]">Our Collection</h2>
              <p className="mt-4 text-base leading-7 text-[#70664f]">
                Each piece is a unique work of art, handcrafted by skilled artisans inspired by the rich legacy of Khan El Khalili.
              </p>
              <MotionList as="ul" className="mt-6 grid gap-3">
                {collections.map((item) => (
                  <MotionItem as="li" key={item} className="flex items-center gap-3 text-sm font-bold text-[#211900]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d9a928]" />
                    {item}
                  </MotionItem>
                ))}
              </MotionList>
            </MotionBlock>

            <MotionBlock className="rounded-[28px] border border-[#ead9a5] bg-[#fffaf0] p-7" delay={0.06}>
              <h2 className="text-2xl font-black text-[#b88710]">Why Choose Us?</h2>
              <p className="mt-4 text-base leading-7 text-[#70664f]">
                Our commitment to quality and heritage ensures every piece tells a story of Egypt's cultural richness.
              </p>
              <MotionList as="ul" className="mt-6 grid gap-3">
                {values.map((item) => (
                  <MotionItem as="li" key={item} className="flex items-center gap-3 text-sm font-bold text-[#211900]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d9a928]" />
                    {item}
                  </MotionItem>
                ))}
              </MotionList>
            </MotionBlock>
          </div>
        </section>

        <section className="premium-section px-5 py-14">
          <MotionBlock className="mx-auto max-w-4xl text-center">
            <p className="text-2xl font-black leading-10 text-[#211900] sm:text-3xl">
              "We weave Egypt's heritage into every piece, creating art that inspires and endures."
            </p>
          </MotionBlock>
        </section>

        <section className="bg-white px-5 py-14">
          <div className="mx-auto max-w-5xl">
            <MotionBlock className="text-center">
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Visit Us</span>
              <h2 className="mt-3 text-3xl font-black text-[#211900]">El Moez Street, Cairo</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#70664f]">
                Discover our craft in person and see the materials, finishing, and detail up close.
              </p>
              <a
                href="https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw"
                target="_blank"
                rel="noopener noreferrer"
                className="premium-button mt-6 inline-flex min-h-12 items-center justify-center px-8 text-sm"
              >
                View on Google Maps
              </a>
            </MotionBlock>
            <MotionBlock className="mt-8 overflow-hidden rounded-[28px] border border-[#ead9a5] shadow-[0_18px_50px_rgba(43,34,1,0.12)]">
              <iframe
                src="https://www.google.com/maps?q=El+Moez+Street,+Cairo,+Egypt&output=embed"
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Khaled El Gamal Location"
                aria-label="Map showing Khaled El Gamal's location on El Moez Street, Cairo"
              />
            </MotionBlock>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
