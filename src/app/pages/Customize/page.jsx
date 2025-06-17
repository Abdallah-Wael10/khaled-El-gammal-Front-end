import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import CustomizeForm from '@/app/components/CustomizeForm/page'

const Customize = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav1 />
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <h1 className="text-4xl font-extrabold text-[#FFCF67] mb-4 text-center">
          Customize Your Dream Design
        </h1>
        <p className="w-[60%] h-max text-lg text-gray-700 mb-10  text-center">
          Share your vision with us! Upload an inspiration image and describe your custom design. Our team will bring your ideas to life with expert craftsmanship and attention to detail.
        </p>
        <CustomizeForm />
      </main>
      <Footer />
    </div>
  )
}

export default Customize
