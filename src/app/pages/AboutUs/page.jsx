import React from 'react';
import Nav1 from '@/app/components/Nav1/page';
import Footer from '@/app/components/footer/page';
import Cart from '@/app/components/Cart/page';

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


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Nav1 />
      <Cart />
      <main className="flex-1 flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto text-center bg-gradient-to-b from-white to-gray-100 rounded-xl shadow-lg p-10 mb-12">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#FFCF67] mb-4 tracking-tight">
            Khaled El Gamal

          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Nestled in the vibrant heart of El Moez Street, Khaled El Gamal has celebrated over 20 years of authentic Egyptian craftsmanship, transforming heritage into exquisite handmade art.
          </p>
        </section>

        {/* Content Section */}
        <section className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Our Collection */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-serif font-semibold text-[#D4A017] mb-4">Our Collection</h2>
            <p className="text-gray-600 mb-4">
              Each piece is a unique work of art, handcrafted by skilled artisans inspired by the rich legacy of Khan El Khalili.
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Framed Earthenware
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Stone Boxes
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Stone-Inlaid Tables
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Handmade Chess Sets
              </li>
            </ul>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <h2 className="text-2xl font-serif font-semibold text-[#D4A017] mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 mb-4">
              Our commitment to quality and heritage ensures every piece tells a story of Egypt’s cultural richness.
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Inspired by Khan El Khalili
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> 100% Handmade by Artisans
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Exceptional Craftsmanship
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-2"></span> Unique Art for Your Space
              </li>
            </ul>
          </div>
        </section>

        {/* Quote Section */}
        <section className="w-full max-w-4xl mx-auto text-center mb-12">
          <p className="text-xl sm:text-2xl font-serif italic text-gray-700 max-w-3xl mx-auto">
            “At Khaled El Gamal, we weave Egypt’s heritage into every piece, creating art that inspires and endures.”
          </p>
        </section>

        {/* Visit Us Section */}
        <section className="w-full max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-serif font-semibold text-[#D4A017] text-center mb-4">Visit Us</h3>
          <p className="text-center text-gray-600 mb-6">
            Discover our craft in person at El Moez Street, Cairo.
          </p>
          <div className="flex justify-center mb-6">
            <a
              href="https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-[#D4A017] text-white font-semibold rounded-md shadow hover:bg-[#b58914] transition focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:ring-offset-2"
            >
              View on Google Maps
            </a>
          </div>
          <div className="w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps?q=El+Moez+Street,+Cairo,+Egypt&output=embed"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Khaled El Gamal Location"
              aria-label="Map showing Khaled El Gamal's location on El Moez Street, Cairo"
            ></iframe>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;