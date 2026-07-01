"use client";

import React, { useEffect, useState } from "react";
import Logo from "./images/klogo.png";
import acc from "./images/acc.svg";
import cart from "./images/cartt.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch } from "react-redux";
import { openCart } from "@/app/redux/slices/cartSlice";
import { drawerSlide, fadeIn, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/shop", label: "Shop" },
  { href: "/pages/Business", label: "Business" },
  { href: "/pages/Customize", label: "Customize" },
  { href: "/pages/Gallery", label: "Gallery" },
  { href: "/pages/AboutUs", label: "About Us" },
  { href: "/pages/ContactUs", label: "Contact Us" },
];

const isActiveLink = (pathname, href) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const Nav1 = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleCartOpen = () => {
    setOpen(false);
    dispatch(openCart());
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#241d04]/92 text-white shadow-[0_18px_40px_rgba(33,25,0,0.22)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-h-11 items-center rounded-full pr-3 focus-visible:outline-offset-4" aria-label="Khaled El Gamal home">
          <Image src={Logo} alt="Khaled El Gamal logo" className="h-[54px] w-auto object-contain" priority />
        </Link>

        <motion.div
          className="hidden items-center justify-center rounded-full border border-white/10 bg-white/[0.06] p-1.5 shadow-inner min-[1016px]:flex"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);
            return (
              <motion.div key={link.href} variants={staggerItem}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 ${
                    active ? "text-[#211900]" : "text-white/88 hover:text-[#f8d77e]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="public-nav-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f7d878] via-[#d9a928] to-[#b88710]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="hidden items-center gap-2 min-[1016px]:flex">
          <motion.div {...scaleTap}>
            <Link
              href="/pages/login"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] transition-colors hover:bg-white/[0.12]"
              aria-label="Login to account"
            >
              <Image src={acc} alt="" className="h-6 w-6" aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.button
            type="button"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#d9a928]/35 bg-[#d9a928]/14 transition-colors hover:bg-[#d9a928]/24"
            onClick={handleCartOpen}
            aria-label="Open cart"
            {...scaleTap}
          >
            <Image src={cart} alt="" className="h-6 w-6" aria-hidden="true" />
          </motion.button>
        </div>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] min-[1016px]:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="public-mobile-menu"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-transform duration-200 ${open ? "rotate-45" : "-translate-y-2"}`} />
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`absolute h-0.5 w-6 rounded-full bg-white transition-transform duration-200 ${open ? "-rotate-45" : "translate-y-2"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 h-dvh w-full cursor-default bg-black/58 backdrop-blur-sm min-[1016px]:hidden"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="hidden"
            />
            <motion.aside
              id="public-mobile-menu"
              className="fixed right-0 top-0 z-50 flex h-dvh w-[86vw] max-w-[360px] flex-col border-l border-[#ead9a5]/30 bg-[#241d04] px-6 pb-6 pt-7 shadow-2xl min-[1016px]:hidden"
              variants={drawerSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="mb-8 flex items-center justify-between">
                <Image src={Logo} alt="Khaled El Gamal logo" className="h-12 w-auto object-contain" priority />
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-2xl leading-none text-white"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  &times;
                </button>
              </div>

              <motion.div className="flex flex-col gap-2" variants={staggerContainer} initial="hidden" animate="visible">
                {navLinks.map((link) => {
                  const active = isActiveLink(pathname, link.href);
                  return (
                    <motion.div key={link.href} variants={staggerItem}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold transition-colors ${
                          active
                            ? "bg-[#d9a928] text-[#211900]"
                            : "text-white/88 hover:bg-white/[0.08] hover:text-[#f8d77e]"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
                <Link
                  href="/pages/login"
                  className="flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-sm font-semibold"
                >
                  Account
                </Link>
                <button
                  type="button"
                  className="premium-button flex min-h-11 items-center justify-center text-sm"
                  onClick={handleCartOpen}
                >
                  Cart
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav1;
