import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Car from "./images/car.svg"
import goldKey from "./images/goldkey.svg"

const Cart = () => {
  return (
    <div className="w-full max-w-md min-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl mx-auto my-10">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-6 border-b border-[#FFCF67]/40">
        <Image src={Car} alt="cart" className="w-8 h-8" />
        <h1 className="text-2xl font-bold text-[#FFCF67] tracking-tight">Your Cart</h1>
      </div>

      {/* Empty Cart Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-12">
        <div className="bg-[#FFF8E1] rounded-full p-6 shadow-inner">
          <Image src={goldKey} alt="gold key" className="w-16 h-16" />
        </div>
        <h2 className="text-lg font-semibold text-center text-[#A4A4A4]">
          Your cart is currently empty
        </h2>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-xl bg-[#FFCF67] text-white text-base font-bold shadow-md hover:bg-[#FFD96B] hover:scale-105 active:scale-95 transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default Cart
