import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import Form from '@/app/components/Form/page'
import Cart from '@/app/components/Cart/page';

export const metadata = {
  title: "Contact Us | Khaled El Gamal",
  description: "Contact Khaled El Gamal for inquiries, support, or custom orders. We're here to help you.",
  keywords: "Contact Khaled El Gamal, Support, Inquiry, Custom Order, Egyptian Art",
  openGraph: {
    title: "Contact Us | Khaled El Gamal",
    description: "Contact Khaled El Gamal for inquiries, support, or custom orders. We're here to help you.",
    url: "https://your-domain.com/pages/ContactUs",
    siteName: "Khaled El Gamal",
    images: [
      {
        url: "https://your-domain.com/khaledbg.jpg",
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
    <div className='bg-white'>
         <Nav1/>
          <Cart/>
      <section className="w-full h-max pb-5 pt-5 bg-white flex justify-center items-center">
        <Form />
      </section>
         <Footer/>
    </div>
  )
}

export default ContactUs
