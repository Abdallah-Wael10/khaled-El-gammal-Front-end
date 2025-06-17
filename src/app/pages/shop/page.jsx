"use client";
import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Image from 'next/image'
import key from "./images/key.svg"
import Link from 'next/link'
import Footer from '@/app/components/footer/page'
import Card from '@/app/components/Card/page';
const Shop = () => {

const ProductCategory = [
   "All Products",
   "Frame earthenware",
   "Box with Stone",
   "Table with Stone",
   "Chess",
]
const PriceFilter = [
   "Low to High",
   "High to Low",
   "Discount"
]
  return (
    <div>
        <Nav1/>
            <section className='w-full h-max pb-5 pt-5 flex flex-col justify-center items-center bg-white'>
                <div className='w-[70%] h-max    rounded-[33px] bg-gradient-to-r from-[#FFFFFF] to-[#FFF6D4] shadow-[2px_2px_19px] flex justify-center items-center'>
                      <div className='w-[28%] h-[155px] flex justify-center pl-5 items-center'>
                        <h1 className='w-full h-max text-[26px] font-bold text-black'>Buy More <span className='text-[#FFCF67]'>Save More Special Ra</span>tes for Bulk Orders</h1>
                      </div>
                      <div className='w-[40%] h-max pb-8 flex justify-center items-center '><Image src={key} alt='key icon' priority/></div>
                      <div className='w-[32%]  h-[155px] flex justify-center items-center'>
                            <Link href="/" className='w-[50%] h-[60px] rounded-[30px] text-[16px] flex justify-center items-center text-center font-semibold bg-[#FFCF67]'>Business</Link>
                      </div>
                </div>
                <div className='w-[50%] h-[120px] mt-5 rounded-[33px] bg-gradient-to-r from-[#FFFFFF] to-[#FFF6D4] shadow-[2px_2px_19px] flex justify-center items-center'>
                     <div className='w-1/3 h-[120px] flex justify-center items-center'>
                        {/* drop down for product category  */}
                        <select
                            className='w-[80%] p-2 rounded-[30px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]'
                        >
                            {ProductCategory.map((category, index) => (
                                <option className="bg-white text-black font-semibold" key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                     </div>
                     <div className='w-1/3 h-[120px] flex justify-center items-center'>
                                <h1 className='w-1/2 text-center text-[#FFCF67] font-medium text-[16px]'>Availability</h1>
                                <input
                                    type="checkbox"
                                    className='w-[19px] h-[19px] accent-[#FFCF67] transition-all duration-200 focus:ring-2 focus:ring-[#FFCF67]'
                                    name="availability"
                                    id="in-stock"
                                />
                                <label htmlFor="in-stock" className='text-[#A4A4A4] font-medium pl-2'>In Stock</label>
                     </div>
                     <div className='w-1/3 h-[120px] flex justify-center items-center'>
                            {/* drop down for price filter with default value "Price" */}
                            <select
                                className='w-[80%] p-2 rounded-[30px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]'
                                defaultValue=""
                            >
                                <option value="" disabled hidden>Price</option>
                                {PriceFilter.map((price, index) => (
                                    <option className="bg-white text-black font-medium" key={index} value={price}>
                                        {price}
                                    </option>
                                ))}
                            </select>
                     </div>
                </div>
            </section>
            <section className='w-full h-max pb-5 pt-5 flex justify-center items-center flex-wrap gap-10 bg-white'>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
                    <Card/>
            </section>
        <Footer/>
    </div>
  )
}

export default Shop
