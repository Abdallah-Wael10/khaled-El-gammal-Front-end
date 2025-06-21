"use client";
import React, { useState } from 'react'
import Logo from "./images/klogo.png"
import acc from "./images/acc.svg"
import cart from "./images/cartt.svg"
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from "react-redux";
import { openCart } from "@/app/redux/slices/cartSlice";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/shop", label: "Shop" },
  { href: "/pages/Business", label: "Business" },
  { href: "/pages/Customize", label: "Customize" },
  { href: "/pages/Gallery", label: "Gallery" },
  { href: "/pages/AboutUs", label: "About Us" },
  { href: "/pages/ContactUs", label: "Contact Us" },
];

const Nav1 = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full h-[80px] bg-gradient-to-r from-[#2B2201] to-[#917405] shadow-lg relative flex items-center z-50">
      {/* Desktop (from 901px up) */}
      <div className="w-full items-center justify-between px-8 flex max-[1015px]:hidden">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={Logo} alt="logo" className="object-contain h-[54px] w-auto" priority />
          </Link>
        </div>
        {/* Links */}
        <div className="flex-1 flex justify-center items-center gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-2 py-1 text-white text-[16px] font-medium transition group"
            >
              <span className="group-hover:text-[#FFCF67] transition">{link.label}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#FFCF67] rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>
        {/* Icons */}
        <div className="flex items-center gap-5">
          <Link href="/pages/login">
            <Image src={acc} alt="login" className="w-7 h-7 hover:scale-110 transition" />
          </Link>
          <button
            className="cursor-pointer active:scale-90 hover:scale-110 transition"
            onClick={() => dispatch(openCart())}
            aria-label="Open cart"
          >
            <Image src={cart} alt="cart" className="w-7 h-7" />
          </button>
        </div>
      </div>
      {/* Mobile (0 - 1015px) */}
      <div className="w-full items-center justify-between px-4 hidden max-[1015px]:flex">
        {/* Logo Center */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <Image src={Logo} alt="logo" className="object-contain h-[48px] w-auto" priority />
          </Link>
        </div>
        {/* Toggle */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center w-10 h-10 pl-5"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-7 bg-white rounded transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block h-0.5 w-7 bg-white rounded my-1 transition-all duration-300 ${open ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-7 bg-white rounded transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
        {/* Slide Menu */}
        <div className={`fixed top-0 right-0 h-screen w-[80vw] max-w-xs bg-gradient-to-br from-[#2B2201] to-[#917405] shadow-2xl z-40 flex flex-col items-center pt-24 gap-8 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white text-lg font-semibold px-4 py-2 rounded hover:bg-[#FFCF67]/20 transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-6 mt-6">
            <Link href="/pages/login" onClick={() => setOpen(false)}>
              <Image src={acc} alt="login" className="w-7 h-7 hover:scale-110 transition" />
            </Link>
            <button
              className="cursor-pointer active:scale-90 hover:scale-110 transition"
              onClick={() => {
                setOpen(false);
                dispatch(openCart());
              }}
              aria-label="Open cart"
            >
              <Image src={cart} alt="cart" className="w-7 h-7" />
            </button>
          </div>
        </div>
        {/* Overlay */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </nav>
  );
};

export default Nav1;
