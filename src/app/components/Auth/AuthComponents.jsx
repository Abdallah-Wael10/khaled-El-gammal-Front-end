"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import Logo from "@/app/components/Nav1/images/klogo.png";
import { fadeUp, motionDurations, motionEase, scaleTap } from "@/app/lib/motion";

const shellEase = { duration: motionDurations.ui, ease: motionEase };

export function UserAuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[var(--brand-ivory)] px-4 py-10 text-[var(--brand-ink)]">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 12% 18%, rgba(217,169,40,0.14), transparent 28rem), radial-gradient(circle at 88% 82%, rgba(184,135,16,0.1), transparent 24rem), linear-gradient(180deg, #fffdf7 0%, #fffaf0 100%)",
        }}
      />

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-[var(--shadow-lift)] md:grid-cols-[0.98fr_1.02fr]"
      >
        <div className="relative hidden flex-col justify-between overflow-hidden p-8 md:flex">
          <div
            className="absolute inset-0 bg-star bg-cover bg-center opacity-[0.05]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#fff7df] via-[#fffaf0] to-[#fff1bf]"
            aria-hidden="true"
          />

          <div className="relative">
            <Link href="/" className="inline-block rounded-lg focus-visible:outline-offset-4">
              <Image
                src={Logo}
                alt="Khaled El Gamal"
                className="h-[4.25rem] w-auto object-contain"
                priority
              />
            </Link>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#9b8b64]">
              Handmade Egyptian Art
            </p>
          </div>

          <div className="relative">
            <h1 className="text-3xl font-black leading-tight text-[var(--brand-ink)]">
              Welcome back.
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--brand-muted)]">
              Sign in to explore handcrafted treasures, save favorites, and track your orders.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 md:hidden">
            <Link href="/" className="inline-block rounded-lg focus-visible:outline-offset-4">
              <Image
                src={Logo}
                alt="Khaled El Gamal"
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
            Customer account
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--brand-ink)] sm:text-[1.75rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>

          {footer && <div className="mt-5 border-t border-[#eee2c9] pt-5">{footer}</div>}
        </div>
      </motion.section>
    </main>
  );
}

export function AuthField({ label, error, children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-[#2d250d]">
      {label}
      <div className="mt-1.5">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={shellEase}
            className="mt-1.5 text-sm font-semibold text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

export const authInputClass =
  "min-h-11 w-full rounded-xl border border-[#ded6c0] bg-[#fffdf8] px-3.5 py-2 text-sm text-[var(--brand-ink)] outline-none transition-[border-color,box-shadow,background] duration-200 focus:border-[var(--brand-gold)] focus:bg-white focus:ring-4 focus:ring-[rgba(217,169,40,0.16)] disabled:cursor-not-allowed disabled:opacity-55";

export function AuthButton({
  children,
  variant = "primary",
  className = "",
  loading = false,
  icon: Icon,
  ...props
}) {
  const variants = {
    primary:
      "border-[#c99a20] bg-gradient-to-r from-[#f2c95c] via-[var(--brand-gold)] to-[var(--brand-gold-strong)] text-[var(--brand-ink)] shadow-[0_12px_26px_rgba(184,135,16,0.22)] hover:brightness-[1.03]",
    secondary:
      "border-[#d8ccb3] bg-white text-[#3c310f] hover:border-[#c49a22] hover:bg-[#fff9ea]",
    ghost: "border-transparent bg-transparent text-[#6f5702] hover:bg-[#fff1bf]",
  };

  return (
    <motion.button
      type="button"
      {...scaleTap}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-[filter,background,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : Icon ? (
        <Icon className="h-4 w-4" aria-hidden="true" />
      ) : null}
      {children}
    </motion.button>
  );
}

export function AuthLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center text-sm font-semibold text-[var(--brand-olive)] transition-colors hover:text-[var(--brand-ink)] hover:underline ${className}`}
    >
      {children}
    </Link>
  );
}
