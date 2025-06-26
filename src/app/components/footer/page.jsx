import React from 'react'
import logo from "./images/flogo.png"
import Image from 'next/image'
import Link from 'next/link'
import map from "./images/mapp.svg"
import facebook from "./images/facebook.svg"
import instagram from "./images/instaa.svg"
import wp from "./images/wp.svg"
import call from "./images/call.svg"
const Footer = () => {
  return (
    <footer className='w-full h-max pb-5 pt-5 flex justify-center items-center bg-[#896B2A] max-[900px]:flex-wrap '>
                <div className='w-[30%] h-max pb-5 text-white text-[16px] font-semibold flex flex-col  justify-center gap-5 items-center max-[900px]:w-full'>
                     <Link href="/" className='w-full h-max text-center'>Home</Link> 
                     <Link href="/pages/shop" className='w-full h-max text-center'>Shop</Link> 
                     <Link href="/pages/Business" className='w-full h-max text-center'>Business</Link> 
                     <Link href="/pages/Customize" className='w-full h-max text-center'>Customize</Link> 
                     <Link href="/pages/Gallery" className='w-full h-max text-center'>Gallery</Link> 
                     <Link href="/pages/AboutUs" className='w-full h-max text-center'>About Us</Link> 
                     <Link href="/pages/ContactUs" className='w-full h-max text-center'>Contact Us</Link> 
               </div>
                    <div className='w-[40%] h-max pb-5 pt-5 flex justify-center items-center max-[900px]:w-full'>
                        <Image src={logo} alt="logo" className=' object-cover' priority/>
                    </div>
                        <div className='w-[30%] h-max pb-5 flex flex-col justify-center  items-center gap-6 max-[900px]:w-full '>
                                    <div className='w-full h-max flex justify-center items-center gap-5 pt-5'>
                                        <Image src={map} alt='icon' priority/>
                                        <a href="https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw"  target="_blank" rel="noopener noreferrer">Khaled gamal</a>
                                    </div>
                                    <div className='w-full h-max flex justify-center items-center gap-8 pt-5 max-[900px]:pt-0'>
                                        <Image src={call} alt='icon' priority/>
                                        <a href="tel:+201159227861">01159227861</a>
                                    </div>
                                    <div className='w-full h-max flex justify-center items-center gap-9'>
                                    
                                    <a href="tel:+201159227861"><Image src={wp} alt='whatsapp icon'/></a>
                                    <a href="https://www.facebook.com/?locale=ar_AR"><Image src={facebook} alt='facebook icon'/></a>
                                    <a href="https://www.instagram.com"><Image src={instagram} alt='instagram icon'/></a>


                                    </div>

                        </div>
    </footer>
  )
}

export default Footer
