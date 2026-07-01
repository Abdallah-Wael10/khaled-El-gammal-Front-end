"use client";

import React from "react";
import GoldKey from "@/app/components/Cart/images/goldkey.svg";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const variantClasses = {
  screen: "min-h-dvh w-full bg-[#fffaf0] px-5 py-12",
  section: "min-h-[320px] w-full bg-transparent px-5 py-10",
  inline: "min-h-[180px] w-full bg-transparent px-4 py-8",
  overlay: "absolute inset-0 z-20 min-h-full w-full bg-white/82 px-5 py-10 backdrop-blur-sm",
};

const Loading = ({
  variant = "screen",
  message = "Loading, please wait...",
  detail = "Preparing the experience",
  className = "",
}) => {
  const reduceMotion = useReducedMotion();
  const isScreen = variant === "screen";
  const containerClass = variantClasses[variant] || variantClasses.screen;

  return (
    <div
      className={`flex items-center justify-center text-[#211900] ${containerClass} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#ead9a5] bg-white/92 p-7 text-center shadow-[0_18px_50px_rgba(43,34,1,0.12)] sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f2c95c] via-[#d9a928] to-[#b88710]" />

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1bf] shadow-inner">
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={reduceMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="flex h-16 w-16 items-center justify-center"
          >
            <Image
              src={GoldKey}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 drop-shadow-md"
              priority={isScreen}
              aria-hidden="true"
            />
          </motion.div>
        </div>

        <h1 className="mt-6 text-xl font-black tracking-tight text-[#211900]">
          {message}
        </h1>
        <p className="mt-2 text-sm font-semibold leading-6 text-[#70664f]">
          {detail}
        </p>

        <div className="mt-7 grid gap-3" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <motion.span
              key={item}
              className="h-3 rounded-full bg-gradient-to-r from-[#fff1bf] via-[#d9a928]/45 to-[#fff1bf]"
              initial={reduceMotion ? false : { opacity: 0.45, scaleX: 0.88 }}
              animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scaleX: [0.88, 1, 0.88] }}
              transition={reduceMotion ? undefined : { duration: 1.1, delay: item * 0.12, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only">{message}</span>
    </div>
  );
};

export default Loading;
