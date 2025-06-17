import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import Form from '@/app/components/Form/page'
const ContactUs = () => {
  return (
    <div className='bg-white'>
         <Nav1/>
         <section className='w-full h-max pb-10 pt-10 flex flex-col justify-center items-center'>
            <Form/>
         </section>
         <Footer/>
    </div>
  )
}

export default ContactUs
