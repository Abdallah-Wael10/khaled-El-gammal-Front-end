import React from 'react'
import Logo from "./images/klogo.png"
import acc from "./images/acc.svg"
import cart from "./images/cartt.svg"
import Image from 'next/image'
import Link from 'next/link'
const Nav1 = () => {
  return (
    <nav className='w-full h-[80px] bg-gradient-to-r from-[#2B2201] to-[#917405]   relative flex justify-center items-center'>
        <div className='w-[25%] h-[80px] flex justify-center items-center'>
            <Link href="/"><Image src={Logo} alt="logo"  className=' object-contain'/></Link>
        </div>
        <div className='w-[50%] h-[80px] flex justify-center items-center gap-5 text-white text-[16px] font-medium '>
            <Link href="/">Home</Link>
            <Link href="/pages/shop">Shop</Link>
            <Link href="/pages/Business">Business</Link>
            <Link href="/pages/Customize">Customize</Link>
            <Link href="/pages/Gallery">Gallery</Link>
            <Link href="/pages/AboutUs">About Us</Link>
            <Link href="/pages/ContactUs">Contact Us</Link>
        </div>
        <div className='w-[25%] h-[80px] flex justify-center items-center gap-5'>
            <Link href="/pages/login"> <Image src={acc} alt='login' />   </Link>
            <Link href="/"> <Image src={cart} alt='cart' />   </Link>
        </div>
    </nav>
  )
}

export default Nav1
