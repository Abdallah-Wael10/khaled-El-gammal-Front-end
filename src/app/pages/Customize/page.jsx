import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import CustomizeForm from '@/app/components/CustomizeForm/page'
import Cart from '@/app/components/Cart/page';

const Customize = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav1 />
      <Cart />
      <main className="flex flex-col items-center justify-center flex-1 px-2 md:px-4 py-6 md:py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FFCF67] mb-4 text-center">
          Customize Your Dream Design
        </h1>
        <p className="w-full max-w-[600px] h-max text-base md:text-lg text-gray-700 mb-6 md:mb-10 text-center">
          Share your vision with us! Upload an inspiration image and describe your custom design. Our team will bring your ideas to life with expert craftsmanship and attention to detail.
        </p>
        <CustomizeForm />
      </main>
      <Footer />
    </div>
  )
}

export default Customize
