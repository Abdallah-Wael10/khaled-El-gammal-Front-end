"use client";

import React from "react";
import logo from "./images/flogo.png";
import Image from "next/image";
import Link from "next/link";
import map from "./images/mapp.svg";
import facebook from "./images/facebook.svg";
import instagram from "./images/instaa.svg";
import wp from "./images/wp.svg";
import call from "./images/call.svg";
import { motion } from "motion/react";
import { fadeUp, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/pages/shop", label: "Shop" },
  { href: "/pages/Business", label: "Business" },
  { href: "/pages/Customize", label: "Customize" },
  { href: "/pages/Gallery", label: "Gallery" },
  { href: "/pages/AboutUs", label: "About Us" },
  { href: "/pages/ContactUs", label: "Contact Us" },
];

const Footer = () => {
  return (
    <footer className="border-t border-[#ead9a5] bg-[#241d04] text-white">
      <motion.div
        className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1fr_1.2fr_1fr] lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <motion.nav variants={staggerItem} aria-label="Footer navigation">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-[#f8d77e]">Explore</h2>
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-white/78 sm:max-w-sm">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="min-h-10 rounded-lg py-2 transition-colors hover:text-[#f8d77e]">
                {link.label}
              </Link>
            ))}
          </div>
        </motion.nav>

        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center text-center">
          <Image src={logo} alt="Khaled El Gamal logo" className="h-auto w-[220px] max-w-[70vw] object-contain" priority />
          <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
            Handcrafted Egyptian pieces shaped by heritage, detail, and a long-standing love for Khan El Khalili craft.
          </p>
        </motion.div>

        <motion.div variants={staggerItem} className="flex flex-col gap-5 lg:items-start">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#f8d77e]">Contact</h2>
          <a
            href="https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-xl text-sm font-semibold text-white/78 transition-colors hover:text-[#f8d77e]"
          >
            <Image src={map} alt="" className="h-5 w-5" aria-hidden="true" />
            Khaled El Gamal
          </a>
          <a
            href="tel:+201159227861"
            className="flex min-h-11 items-center gap-3 rounded-xl text-sm font-semibold text-white/78 transition-colors hover:text-[#f8d77e]"
          >
            <Image src={call} alt="" className="h-5 w-5" aria-hidden="true" />
            01159227861
          </a>
          <div className="flex items-center gap-3">
            {[
              { href: "tel:+201159227861", img: wp, label: "Call or WhatsApp" },
              { href: "https://www.facebook.com/?locale=ar_AR", img: facebook, label: "Facebook" },
              { href: "https://www.instagram.com", img: instagram, label: "Instagram" },
            ].map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] transition-colors hover:bg-white/[0.14]"
                aria-label={item.label}
                {...scaleTap}
              >
                <Image src={item.img} alt="" className="h-5 w-5" aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
