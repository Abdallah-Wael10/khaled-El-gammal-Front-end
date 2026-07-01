"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart, closeCart } from "@/app/redux/slices/cartSlice";
import goldKey from "./images/goldkey.svg";
import { useGetShippingQuery } from "@/app/features/Api/ShippingApi";
import { drawerSlide, fadeIn, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";
import { getSellingPrice, hasDiscount } from "@/app/utils/pricing";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector((state) => state.cart);
  const { data: shippingData, isLoading: shippingLoading } = useGetShippingQuery();

  useEffect(() => {
    if (!isCartOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") dispatch(closeCart());
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [dispatch, isCartOpen]);

  const subtotal = items.reduce(
    (sum, item) => sum + getSellingPrice(item.price, item.discountPrice) * item.quantity,
    0
  );

  const shippingCost = shippingData?.shippingCost ?? 0;
  const total = subtotal + (shippingLoading ? 0 : shippingCost || 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-[70] h-dvh w-full cursor-default bg-black/60 backdrop-blur-sm"
            aria-label="Close cart overlay"
            onClick={() => dispatch(closeCart())}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col rounded-l-[28px] border-l border-[#ead9a5] bg-[#fffdf8] text-[#211900] shadow-2xl"
            variants={drawerSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-[#ead9a5] px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff1bf]">
                  <Image src={goldKey} alt="" className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#211900]">Your Cart</h1>
                  <p className="text-sm font-medium text-[#70664f]">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => dispatch(closeCart())}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ead9a5] bg-white text-2xl leading-none text-[#6f5702] transition-colors hover:bg-[#fff1bf]"
                aria-label="Close cart"
              >
                &times;
              </button>
            </div>

            <motion.div
              className="custom-scrollbar flex-1 overflow-y-auto px-4 py-5 sm:px-5"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {items.length === 0 ? (
                <motion.div
                  className="flex min-h-[54vh] flex-col items-center justify-center gap-5 text-center"
                  variants={staggerItem}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff1bf] text-3xl font-black text-[#b88710]">
                    0
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#211900]">Your cart is empty</h2>
                    <p className="mt-1 max-w-[260px] text-sm leading-6 text-[#70664f]">
                      Browse the collection and add a handcrafted piece to continue.
                    </p>
                  </div>
                  <Link
                    href="/pages/shop"
                    className="premium-button inline-flex min-h-11 items-center justify-center px-6 text-sm"
                    onClick={() => dispatch(closeCart())}
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        variants={staggerItem}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
                        className="grid grid-cols-[88px_1fr] gap-3 rounded-2xl border border-[#ead9a5] bg-white p-3 shadow-sm"
                      >
                        <div className="aspect-square overflow-hidden rounded-xl border border-[#ead9a5] bg-[#fffaf0]">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}`}
                            alt={item.title}
                            width={120}
                            height={120}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-[#211900]">{item.title}</div>
                          <div className="mt-1 text-sm font-semibold text-[#b88710]">
                            {hasDiscount(item.discountPrice) ? (
                              <>
                                <span>{getSellingPrice(item.price, item.discountPrice)} LE</span>
                                <span className="ml-2 text-xs text-red-500 line-through">{item.price} LE</span>
                              </>
                            ) : (
                              <span>{item.price} LE</span>
                            )}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ead9a5] bg-[#fffaf0] text-base font-bold text-[#6f5702] disabled:cursor-not-allowed disabled:opacity-45"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease ${item.title} quantity`}
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ead9a5] bg-[#fffaf0] text-base font-bold text-[#6f5702]"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              aria-label={`Increase ${item.title} quantity`}
                            >
                              +
                            </button>
                            <button
                              type="button"
                              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              title="Remove"
                              onClick={() => dispatch(removeFromCart(item.id))}
                              aria-label={`Remove ${item.title}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {items.length > 0 && (
              <div className="border-t border-[#ead9a5] bg-white px-5 py-5">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between font-semibold text-[#70664f]">
                    <span>Subtotal</span>
                    <span>{subtotal} LE</span>
                  </div>
                  <div className="flex justify-between font-semibold text-[#70664f]">
                    <span>Shipping</span>
                    <span>{shippingLoading ? "..." : shippingCost === 0 ? "Free Shipping" : `${shippingCost} LE`}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-[#ead9a5] pt-3 text-xl font-black text-[#211900]">
                    <span>Total</span>
                    <span>{shippingLoading ? "..." : `${total} LE`}</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-[1.35fr_0.65fr] gap-3">
                  <motion.div {...scaleTap}>
                    <Link
                      href="/pages/checkout"
                      className="premium-button flex min-h-12 items-center justify-center px-4 text-center text-sm"
                      onClick={() => dispatch(closeCart())}
                    >
                      Checkout
                    </Link>
                  </motion.div>
                  <button
                    type="button"
                    className="min-h-12 rounded-full bg-red-50 px-4 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                    onClick={() => dispatch(clearCart())}
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #d9a928;
              border-radius: 8px;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #d9a928 #fff1bf;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
