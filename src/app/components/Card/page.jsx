import React from 'react'
import Link from 'next/link'
import vasa from "../Nav1/images/vasa.png"
import Image from 'next/image'

const Card = ({ image, title, price, sizes, addToCart, id }) => {
  return (
    <Link
      href={`/pages/productById/${id}`}
      className="group w-full max-w-xs min-h-[320px] flex flex-col rounded-2xl border border-[#F3E9D2] bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="w-full aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={image || vasa}
          alt={title || "Product"}
          className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
      {/* Title & Price */}
      <div className="flex justify-between items-center px-4 pt-4">
        <h1 className="text-base font-semibold text-gray-900 truncate">{title || "VASA EGY"}</h1>
        <span className="text-lg font-bold text-[#FFCF67]">{price ? `${price} LE` : "500 LE"}</span>
      </div>
      {/* Description */}
      <div className="px-4 pt-2 pb-4 flex-1 flex items-center">
        <p className="text-sm text-[#BCBCBC] font-medium">
          Please add your content here. Keep it short and simple. And smile
        </p>
      </div>
      {/* Hover Accent Bar */}
      <div className="h-1 bg-[#FFCF67] w-0 group-hover:w-full transition-all duration-300" />
    </Link>
  )
}

export default Card
