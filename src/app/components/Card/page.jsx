"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import vasa from "../Nav1/images/vasa.png";
import Image from "next/image";
import { motion } from "motion/react";
import { scaleTap } from "@/app/lib/motion";
import { getSellingPrice, hasDiscount } from "@/app/utils/pricing";

const Card = ({ image, title, price, description, discountPrice, inStock, stock, id }) => {
  const isOutOfStock = !inStock || Number(stock) === 0;
  const discounted = hasDiscount(discountPrice);
  const sellingPrice = getSellingPrice(price, discountPrice);
  const [imgSrc, setImgSrc] = useState(image || vasa);

  useEffect(() => {
    setImgSrc(image || vasa);
  }, [image]);

  return (
    <motion.div
      className="w-full max-w-xs"
      whileHover={isOutOfStock ? undefined : { y: -6 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      {...scaleTap}
    >
      <Link
        href={`/pages/productById/${id}`}
        aria-label={`View ${title || "product"}${price ? `, ${sellingPrice} LE` : ""}`}
        className={`group relative flex min-h-[380px] w-full flex-col overflow-hidden rounded-2xl border border-[#ead9a5] bg-white shadow-[0_10px_30px_rgba(43,34,1,0.08)] transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(43,34,1,0.14)] ${
          isOutOfStock ? "opacity-75" : ""
        }`}
      >
        {isOutOfStock && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
            Out of stock
          </div>
        )}

        {discounted && !isOutOfStock && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-[#FFCF67] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#2B2201] shadow-sm">
            Sale
          </div>
        )}

        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#FFFDF7]">
          <Image
            src={imgSrc}
            alt={title || "Product"}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            width={400}
            height={300}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            loading="lazy"
            onError={() => setImgSrc(vasa)}
          />
          {!isOutOfStock && (
            <span className="absolute bottom-2.5 right-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[#6f5702] shadow-sm ring-1 ring-[#ead9a5]">
              {stock} in stock
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col px-4 pb-0 pt-3.5">

          <h2 className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-[#211900]">
            {title || "Untitled product"}
          </h2>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            {discounted ? (
              <>
                <span className="text-base font-bold tabular-nums text-[#b88710]">
                  {sellingPrice} <span className="text-sm">LE</span>
                </span>
                <span className="text-sm font-medium tabular-nums text-[#9b8b64] line-through">
                  {price} LE
                </span>
              </>
            ) : (
              <span className="text-base font-bold tabular-nums text-[#b88710]">
                {price ? (
                  <>
                    {price} <span className="text-sm">LE</span>
                  </>
                ) : null}
              </span>
            )}
          </div>

          <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#70664f]">
            {description || "Handcrafted piece from Khaled El Gamal."}
          </p>

          <div className="mt-4 flex min-h-11 items-center justify-between border-t border-[#ead9a5]/75 py-3">
            <span className="text-sm font-semibold text-[#6f5702] transition-colors group-hover:text-[#211900]">
              View details
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff7df] text-[#b88710] transition-colors group-hover:bg-[#FFCF67]/35">
              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="h-1 w-0 bg-[#FFCF67] transition-all duration-300 group-hover:w-full" />
      </Link>
    </motion.div>
  );
};

export default Card;
