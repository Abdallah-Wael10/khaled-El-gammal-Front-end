"use client";

import React from "react";
import Link from "next/link";
import vasa from "../Nav1/images/vasa.png";
import Image from "next/image";
import { motion } from "motion/react";
import { scaleTap } from "@/app/lib/motion";

const Card = ({ image, title, price, description, discountPrice, inStock, stock, id }) => {
  const isOutOfStock = !inStock || Number(stock) === 0;
  const hasDiscount = Number(discountPrice) > 0;

  return (
    <motion.article
      className="group w-full max-w-xs"
      whileHover={isOutOfStock ? undefined : { y: -7 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      {...scaleTap}
    >
      <Link
        href={`/pages/productById/${id}`}
        aria-label={`View ${title || "product"}`}
        className={`block min-h-[360px] overflow-hidden rounded-[22px] border border-[#ead9a5] bg-white shadow-[0_14px_40px_rgba(43,34,1,0.10)] transition-shadow duration-200 hover:shadow-[0_22px_55px_rgba(43,34,1,0.16)] ${
          isOutOfStock ? "opacity-75" : ""
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#fffaf0]">
          {isOutOfStock && (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
              Out of Stock
            </div>
          )}
          {!isOutOfStock && (
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-[#fffaf0]/95 px-3 py-1 text-xs font-bold text-[#6f5702] shadow-sm ring-1 ring-[#ead9a5]">
              {stock} available
            </span>
          )}
          <Image
            src={image || vasa}
            alt={title || "Product"}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.055]"
            priority
            width={420}
            height={315}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#211900]/18 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="flex min-h-[142px] flex-col gap-3 p-4">
          <div className="grid grid-cols-[1fr_auto] items-start gap-3">
            <h2 className="line-clamp-2 text-base font-bold leading-6 text-[#211900]">
              {title || ""}
            </h2>
            <div className="text-right">
              {hasDiscount ? (
                <>
                  <div className="whitespace-nowrap text-lg font-black text-[#b88710]">
                    {discountPrice} LE
                  </div>
                  <div className="whitespace-nowrap text-sm font-semibold text-red-500 line-through">
                    {price} LE
                  </div>
                </>
              ) : (
                <div className="whitespace-nowrap text-lg font-black text-[#b88710]">
                  {price ? `${price} LE` : ""}
                </div>
              )}
            </div>
          </div>

          <p className="line-clamp-3 text-sm font-medium leading-6 text-[#70664f]">
            {description || "No description available"}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-[#ead9a5]/70 pt-3">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b8b64]">
              Handmade
            </span>
            <span className="text-sm font-bold text-[#6f5702]">View details</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default Card;
