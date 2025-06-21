import React from 'react'
import Link from 'next/link'
import vasa from "../Nav1/images/vasa.png"
import Image from 'next/image'

const Card = ({ image, title, price, description, discountPrice, inStock, stock, id }) => {
  // Determine stock status
  const isOutOfStock = !inStock || Number(stock) === 0;

  return (
    <Link
      href={`/pages/productById/${id}`}
      className={`group w-full max-w-xs min-h-[320px] flex flex-col rounded-2xl border border-[#F3E9D2] bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-in-out overflow-hidden hover:-translate-y-2 relative ${isOutOfStock ? "opacity-70" : ""}`}
    >
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse select-none">
          Out of Stock
        </div>
      )}
      {/* Image Section */}
      <div className="w-full h-58 bg-[#FFFDF7] flex items-center justify-center overflow-hidden relative">
        <Image
          src={image || vasa}
          alt={title || "Product"}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority
          width={400}
          height={192}
        />
        {/* Stock Number Badge */}
        {!isOutOfStock && (
          <span className="absolute bottom-2 right-2 bg-[#FFCF67] text-[#2B2201] text-xs font-bold px-2 py-0.5 rounded shadow">
            In Stock: {stock}
          </span>
        )}
      </div>
      {/* Title & Price */}
      <div className="flex justify-between items-center px-4 mt-2">
        <h1 className="text-base font-bold text-gray-900 truncate">{title || ""}</h1>
        {discountPrice > 0 ? (
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-[#FFCF67]">{discountPrice} LE</span>
            <span className="text-sm text-red-500 line-through">{price} LE</span>
          </div>
        ) : (
          <span className="text-lg font-bold text-[#FFCF67]">{price ? `${price} LE` : ""}</span>
        )}
      </div>
      {/* Description */}
      <div className="px-4 pt-2 pb-4 flex-1 flex items-center">
        <p className="text-sm text-[#BCBCBC] font-semibold">
          {description || "No description available"}
        </p>
      </div>
      {/* Hover Accent Bar */}
      <div className="h-1 bg-[#FFCF67] w-0 group-hover:w-full transition-all duration-300" />
    </Link>
  )
}

export default Card
