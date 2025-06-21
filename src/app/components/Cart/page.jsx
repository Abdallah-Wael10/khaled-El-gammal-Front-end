"use client";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart, closeCart } from "@/app/redux/slices/cartSlice";
import goldKey from "./images/goldkey.svg"

const Cart = () => {
  const dispatch = useDispatch();
  const {items, isCartOpen } = useSelector((state) => state.cart);

  if (!isCartOpen) return null;

  // subtotal بالخصم لو موجود
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice && item.discountPrice > 0
        ? item.discountPrice * item.quantity
        : item.price * item.quantity),
    0
  );

  return (
    <div className="fixed top-0 right-0 z-50 w-full max-w-md min-h-screen bg-white text-black rounded-l-2xl shadow-2xl flex flex-col transition-transform duration-300 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-[#FFCF67]/40">
        <div className="flex items-center gap-4">
          <Image src={goldKey} alt="gold key" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-[#FFCF67] tracking-tight">Your Cart</h1>
        </div>
        <button onClick={() => dispatch(closeCart())} className="text-2xl font-bold text-[#FFCF67] hover:text-[#917405]">&times;</button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 flex flex-col gap-4 px-4 py-4 overflow-y-auto max-h-[calc(100vh-270px)] custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8 py-12">
            <span className="text-lg font-semibold text-[#A4A4A4]">Your cart is currently empty</span>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-[#FFCF67] text-white text-base font-bold shadow-md hover:bg-[#FFD96B] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={() => dispatch(closeCart())}
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl shadow-sm border border-[#FFCF67]/20 p-3 hover:shadow-lg transition">
              <div className="w-[90px] aspect-[4/3] rounded-lg overflow-hidden border border-[#FFCF67]/30 flex-shrink-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}`}
                  alt={item.title}
                  width={120}
                  height={90}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#FFCF67] truncate">{item.title}</div>
                <div className="text-gray-700 font-medium">
                  {item.discountPrice && item.discountPrice > 0 ? (
                    <>
                      <span>{item.discountPrice} LE</span>
                      <span className="ml-2 text-red-500 line-through text-sm">{item.price} LE</span>
                    </>
                  ) : (
                    <span>{item.price} LE</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-[#FFCF67] text-white rounded hover:bg-[#FFD96B] transition"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="px-2">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-[#FFCF67] text-white rounded hover:bg-[#FFD96B] transition"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  >+</button>
                  <button
                    className="ml-3 text-red-500 hover:bg-red-100 rounded-full p-1 transition"
                    title="Remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Footer */}
      {items.length > 0 && (
        <div className="border-t border-[#FFCF67]/30 px-6 py-4 flex flex-col gap-2 bg-white">
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{subtotal} LE</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Shipping</span>
            <span>100 LE</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-[#FFCF67]">
            <span>Total</span>
            <span>{subtotal + 100} LE</span>
          </div>
          <div className="flex gap-2 mt-4">
            <Link
              href="/pages/checkout"
              className="flex-1 px-4 py-2 bg-[#FFCF67] text-white font-bold rounded-xl text-center hover:bg-[#FFD96B] transition"
              onClick={() => dispatch(closeCart())}
            >
              Checkout
            </Link>
            <button
              className="flex-1 px-4 py-2 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #FFCF67;
          border-radius: 8px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #FFCF67 #FFF8E1;
        }
      `}</style>
    </div>
  )
}

export default Cart
