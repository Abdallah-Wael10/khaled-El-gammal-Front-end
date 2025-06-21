"use client";
import React, { useState } from 'react'
import Logo from "../Nav1/images/klogo.png"
import Image from 'next/image'
import Link from 'next/link'
import { removeAuthToken } from '@/app/utils/page';

const navLinks = [
  { href: "/Adminn/dashh", label: "Dashboard" },
  { href: "/Adminn/Products", label: "Products" },
  { href: "/Adminn/Gallery", label: "Gallery" },
  { href: "/Adminn/Orders", label: "Orders" },
  { href: "/Adminn/Customize", label: "Customize" },
  { href: "/Adminn/Business", label: "Business" },
  { href: "/Adminn/ContactUs", label: "Contact Us" },
];

const Nav2 = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full h-[80px] bg-gradient-to-r from-black to-[#2B2201] text-white shadow-lg relative flex items-center z-50">
      {/* Desktop */}
      <div className="w-full items-center justify-between px-8 flex max-[1015px]:hidden">
        {/* Logo left */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image src={Logo} alt="logo" className="object-contain h-[54px] w-auto" priority />
          </Link>
        </div>
        {/* Links center */}
        <div className="flex-1 flex justify-center items-center gap-7 max-[1091px]:gap-1.5">
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
        {/* Logout right */}
        <div className="flex items-center gap-4">
          <Link
            href="/Adminn/login"
            className="text-red-500 font-bold hover:text-[#FFCF67] transition"
            onClick={removeAuthToken}
          >
            Logout
          </Link>
        </div>
      </div>
      {/* Mobile */}
      <div className=" w-full items-center justify-between px-4 hidden max-[1015px]:flex">
        {/* Logo center */}
        <div className="flex-1 flex justify-center">
          <Link href="/">
            <Image src={Logo} alt="logo" className="object-contain h-[48px] w-auto" priority />
          </Link>
        </div>
        {/* Toggle */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col justify-center items-center w-10 h-10 max-[321px]:pl-3 max-[321px]:pr-0 max-[770px]:pr-3"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-7 bg-white rounded transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block h-0.5 w-7 bg-white rounded my-1 transition-all duration-300 ${open ? "opacity-0" : ""}`}></span>
          <span className={`block h-0.5 w-7 bg-white rounded transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
        {/* Slide Menu */}
        <div className={`fixed top-0 right-0 h-screen w-[80vw] max-w-xs bg-gradient-to-br from-black to-[#2B2201] shadow-2xl z-40 flex flex-col items-center pt-24 gap-8 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
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
          <Link
            href="/Adminn/login"
            className="text-red-500 font-bold hover:text-[#FFCF67] transition"
            onClick={() => {
              setOpen(false);
              removeAuthToken();
            }}
          >
            Logout
          </Link>
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

export default Nav2;
