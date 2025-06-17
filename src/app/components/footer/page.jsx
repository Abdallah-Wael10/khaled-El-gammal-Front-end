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
    <footer className='w-full h-[411px] flex justify-center items-center bg-[#896B2A]'>
                <div className='w-[30%] h-max pb-5 text-white text-[12px] font-semibold flex flex-col  justify-center gap-5 items-center'>
                     <Link href="/" className='w-full h-max text-center'>Home</Link> 
                     <Link href="/pages/shop" className='w-full h-max text-center'>Shop</Link> 
                     <Link href="/" className='w-full h-max text-center'>Business</Link> 
                     <Link href="/" className='w-full h-max text-center'>Customize</Link> 
                     <Link href="/" className='w-full h-max text-center'>Gallery</Link> 
                     <Link href="/" className='w-full h-max text-center'>About Us</Link> 
                     <Link href="/" className='w-full h-max text-center'>Contact Us</Link> 
               </div>
                    <div className='w-[40%] h-max pb-5 pt-5 flex justify-center items-center'>
                        <Image src={logo} alt="logo" className=' object-cover' priority/>
                    </div>
                        <div className='w-[30%] h-max pb-5 flex flex-col justify-center items-center gap-6 '>
                                    <div className='w-full h-max flex justify-center items-center gap-5 pt-5'>
                                        <Image src={map} alt='icon' priority/>
                                        <a href="http://" target="_blank" rel="noopener noreferrer">Khaled gamal</a>
                                    </div>
                                    <div className='w-full h-max flex justify-center items-center gap-8 pt-5'>
                                        <Image src={call} alt='icon' priority/>
                                        <a href="tel:+201159227861">01159227861</a>
                                    </div>
                                    <div className='w-full h-max flex justify-center items-center gap-9'>
                                    
                                    <a href="tel:+201159227861"><Image src={wp} alt='whatsapp icon'/></a>
                                    <a href="http://"><Image src={facebook} alt='facebook icon'/></a>
                                    <a href="http://"><Image src={instagram} alt='instagram icon'/></a>


                                    </div>

                        </div>
    </footer>
  )
}

export default Footer
