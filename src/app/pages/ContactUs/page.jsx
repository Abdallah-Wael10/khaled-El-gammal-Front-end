import React from "react";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Form from "@/app/components/Form/page";
import Cart from "@/app/components/Cart/page";
import { MotionBlock } from "@/app/components/MotionShell";

export const metadata = {
  title: "Contact Us | Khaled El Gamal",
  description: "Contact Khaled El Gamal for inquiries, support, or custom orders. We're here to help you.",
  keywords: "Contact Khaled El Gamal, Support, Inquiry, Custom Order, Egyptian Art",
  openGraph: {
    title: "Contact Us | Khaled El Gamal",
    description: "Contact Khaled El Gamal for inquiries, support, or custom orders. We're here to help you.",
    url: "http://localhost:3000/pages/ContactUs",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "http://localhost:3000/khaledbg.webp",
        width: 1200,
        height: 630,
        alt: "Contact Khaled El Gamal",
      },
    ],
    locale: "en_US",
    type: "article",
  },
};

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <section className="premium-section px-5 py-12 text-center sm:py-16">
        <MotionBlock viewport={false} className="mx-auto max-w-3xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Contact</span>
          <h1 className="mt-4 text-4xl font-black text-[#211900] sm:text-5xl">How can we help?</h1>
          <p className="mt-5 text-base font-medium leading-8 text-[#70664f] sm:text-lg">
            Send us your question, custom request, or product inquiry. We will get back to you with the next clear step.
          </p>
        </MotionBlock>
      </section>
      <section className="flex justify-center bg-white px-5 py-14">
        <Form />
      </section>
      <Footer />
    </div>
  );
};

export default ContactUs;
