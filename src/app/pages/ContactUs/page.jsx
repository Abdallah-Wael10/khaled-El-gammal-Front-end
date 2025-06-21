import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import Form from '@/app/components/Form/page'
import Cart from '@/app/components/Cart/page';

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
