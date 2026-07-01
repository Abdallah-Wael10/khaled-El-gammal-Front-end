"use client";

import React, { Fragment, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BarChart3,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleAlert,
  Contact,
  GalleryHorizontalEnd,
  ImagePlus,
  Loader2,
  LogOut,
  Menu,
  Package,
  Search,
  Shield,
  ShoppingBag,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Logo from "@/app/components/Nav1/images/klogo.png";
import { removeAuthToken } from "@/app/utils/page";
import {
  drawerSlide,
  fadeUp,
  modalFadeScale,
  motionDurations,
  motionEase,
  scaleTap,
  staggerContainer,
  staggerItem,
} from "@/app/lib/motion";

export const adminNavItems = [
  { href: "/Adminn/dashh", label: "Dashboard", icon: BarChart3 },
  { href: "/Adminn/Products", label: "Products", icon: Package },
  { href: "/Adminn/Gallery", label: "Gallery", icon: GalleryHorizontalEnd },
  { href: "/Adminn/Orders", label: "Orders", icon: ShoppingBag },
  { href: "/Adminn/Customize", label: "Customize", icon: Sparkles },
  { href: "/Adminn/Business", label: "Business", icon: BriefcaseBusiness },
  { href: "/Adminn/ContactUs", label: "Contact", icon: Contact },
  { href: "/Adminn/users", label: "Users", icon: Users },
];

const shellEase = { duration: motionDurations.ui, ease: motionEase };

function isActiveRoute(pathname, href) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

function NavItems({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1.5">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const active = isActiveRoute(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${
              active
                ? "text-[#211900]"
                : "text-[#f8edd1]/78 hover:bg-white/8 hover:text-white"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <motion.span
                layoutId="admin-active-route"
                className="absolute inset-0 rounded-lg bg-[#f3c85a]"
                transition={shellEase}
              />
            )}
            <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-white/8 group-hover:bg-white/12">
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="relative">{item.label}</span>
            {active && <ChevronRight className="relative ml-auto h-4 w-4" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children, title = "Admin", eyebrow = "Khaled Gammal" }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleLogout = () => {
    removeAuthToken();
    setOpen(false);
    router.push("/Adminn/login");
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-[#181200] text-white">
      <div className="flex min-h-28 items-center border-b border-white/10 px-5 py-4">
        <Link href="/Adminn/dashh" className="block w-full rounded-lg focus-visible:outline-offset-4">
          <Image
            src={Logo}
            alt="Khaled Gammal admin"
            className="h-auto max-h-14 w-full max-w-[220px] object-contain object-left"
            priority
          />
          <div className="mt-3 leading-tight">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f3c85a]">{eyebrow}</div>
            <div className="text-sm font-bold text-white">Admin Console</div>
          </div>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <NavItems onNavigate={() => setOpen(false)} />
      </div>
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/12 hover:text-red-50"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-500/12">
            <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#fbf7ed] text-[#211900]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-black/10 lg:block">
        {sidebar}
      </aside>

      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-[#e8dcc2] bg-[#fbf7ed]/94 px-4 backdrop-blur sm:px-5 lg:ml-72 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#d9caa8] bg-white text-[#211900] shadow-sm lg:hidden"
            aria-label="Open admin menu"
            aria-expanded={open}
            aria-controls="admin-mobile-drawer"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a5f07] sm:text-xs">Admin</p>
            <h1 className="truncate text-base font-bold text-[#211900] sm:text-lg">{title}</h1>
          </div>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#d9caa8] bg-white px-3 text-sm font-semibold text-[#4d3c02] shadow-sm transition-colors hover:border-[#c49a22] hover:text-[#211900]"
        >
          <span className="sm:hidden">Store</span>
          <span className="hidden sm:inline">View Store</span>
        </Link>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/55 lg:hidden"
              aria-label="Close admin menu"
              onClick={() => setOpen(false)}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionDurations.micro }}
            />
            <motion.aside
              id="admin-mobile-drawer"
              className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[21rem] shadow-2xl lg:hidden"
              variants={reduceMotion ? undefined : drawerSlide}
              initial={reduceMotion ? false : { x: "-100%" }}
              animate={reduceMotion ? undefined : { x: 0, opacity: 1 }}
              exit={reduceMotion ? undefined : { x: "-100%", opacity: 0.98 }}
              transition={shellEase}
            >
              <div className="absolute right-3 top-3 z-10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/15"
                  aria-label="Close admin menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.main
        className="overflow-x-hidden lg:ml-72"
        variants={reduceMotion ? undefined : fadeUp}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
}

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-[#e8dcc2] pb-5 sm:mb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 max-w-3xl">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a5f07]">{eyebrow}</p>}
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[#211900] sm:text-2xl lg:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-[#695f4c]">{description}</p>}
      </div>
      {actions && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}

export function AdminPanelHeader({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#eee2c9] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h3 className="text-base font-bold text-[#211900]">{title}</h3>
        {description && <p className="mt-1 text-sm text-[#695f4c]">{description}</p>}
      </div>
      {action && <div className="w-full shrink-0 sm:w-auto [&_a]:block [&_span]:flex [&_span]:w-full sm:[&_span]:w-auto">{action}</div>}
    </div>
  );
}

export function AdminPanel({ children, className = "" }) {
  return (
    <section className={`rounded-lg border border-[#e5d8bd] bg-white shadow-[0_14px_40px_rgba(33,25,0,0.07)] ${className}`}>
      {children}
    </section>
  );
}

export function AdminToolbar({ children, className = "" }) {
  return (
    <div className={`flex flex-col gap-3 border-b border-[#eee2c9] p-4 md:flex-row md:items-center md:justify-between ${className}`}>
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className = "",
  loading = false,
  icon: Icon,
  ...props
}) {
  const variants = {
    primary: "border-[#c99a20] bg-[#d8aa2e] text-[#211900] hover:bg-[#e5bb48]",
    secondary: "border-[#d8ccb3] bg-white text-[#3c310f] hover:border-[#c49a22] hover:bg-[#fff9ea]",
    danger: "border-red-200 bg-red-600 text-white hover:bg-red-700",
    ghost: "border-transparent bg-transparent text-[#5f512d] hover:bg-[#f2ead7]",
  };

  return (
    <motion.button
      type="button"
      {...scaleTap}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </motion.button>
  );
}

export function AdminSearch({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <label className={`relative block w-full md:max-w-sm ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a6c4d]" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-[#d8ccb3] bg-[#fffdf8] py-2 pl-10 pr-3 text-sm text-[#211900] outline-none transition focus:border-[#c99a20] focus:bg-white focus:ring-4 focus:ring-[#d8aa2e]/18"
      />
    </label>
  );
}

export function AdminStatCard({ label, value, href, icon: Icon = BarChart3, tone = "gold" }) {
  const tones = {
    gold: "bg-[#fff7df] text-[#6f5300] border-[#ead59d]",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-sky-50 text-sky-800 border-sky-200",
    neutral: "bg-white text-[#473a17] border-[#e5d8bd]",
  };
  const content = (
    <motion.div
      layout
      variants={staggerItem}
      whileHover={{ y: -3 }}
      transition={shellEase}
      className={`rounded-lg border p-4 shadow-sm sm:p-5 ${tones[tone] || tones.neutral}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold opacity-80 sm:text-sm">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums sm:mt-2 sm:text-3xl">{value}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/70 sm:h-11 sm:w-11">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        </span>
      </div>
    </motion.div>
  );

  return href ? (
    <Link href={href} className="block rounded-lg focus-visible:outline-offset-4">
      {content}
    </Link>
  ) : content;
}

export function AdminStatusBadge({ status }) {
  const normalized = String(status || "Pending").toLowerCase();
  const active = normalized === "active" || normalized === "in stock" || normalized === "yes" || normalized === "true";
  const danger = normalized === "out of stock" || normalized === "deleted" || normalized === "inactive" || normalized === "false";
  const className = active
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : danger
    ? "border-red-200 bg-red-50 text-red-700"
    : "border-amber-200 bg-amber-50 text-amber-800";
  const Icon = active ? Check : danger ? CircleAlert : Loader2;

  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold ${className}`}>
      <Icon className={`h-3.5 w-3.5 ${!active && !danger ? "animate-spin" : ""}`} aria-hidden="true" />
      {status || "Pending"}
    </span>
  );
}

export function AdminEmptyState({ title = "No results found", description, action, icon: Icon = ImagePlus }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-4 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#fff3cf] text-[#7a5f07]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold text-[#211900]">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-[#695f4c]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function AdminSkeleton({ rows = 5, grid = false }) {
  const items = Array.from({ length: rows });
  return (
    <div className={grid ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"} aria-label="Loading content">
      {items.map((_, index) => (
        <div key={index} className="animate-pulse rounded-lg border border-[#eadfc7] bg-white p-4">
          <div className="h-4 w-2/5 rounded bg-[#eee2c9]" />
          <div className="mt-4 h-3 w-full rounded bg-[#f2ead7]" />
          <div className="mt-2 h-3 w-4/5 rounded bg-[#f2ead7]" />
        </div>
      ))}
    </div>
  );
}

export function AdminTable({ children, className = "" }) {
  return <div className={`overflow-x-auto ${className}`}>{children}</div>;
}

export function AdminDesktopTable({ children, className = "" }) {
  return <div className={`hidden overflow-x-auto md:block ${className}`}>{children}</div>;
}

export function AdminMobileList({ children, className = "" }) {
  return <div className={`grid gap-3 p-4 md:hidden ${className}`}>{children}</div>;
}

export function AdminMobileCard({ children, className = "" }) {
  return (
    <article className={`rounded-lg border border-[#f0e5cf] bg-[#fffdf8] p-4 ${className}`}>
      {children}
    </article>
  );
}

export const adminTableClass = "w-full min-w-[640px] text-left text-sm lg:min-w-[760px]";
export const adminThClass = "border-b border-[#e8dcc2] bg-[#fff7e4] px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#6f5702] lg:px-4";
export const adminTdClass = "border-b border-[#f0e5cf] px-3 py-3 align-middle text-[#2d250d] lg:px-4";

export function AdminModal({ open, onClose, title, children, size = "md" }) {
  const titleId = useId();
  const sizeClass = size === "full" ? "max-w-6xl" : size === "lg" ? "max-w-3xl" : "max-w-lg";

  return (
    <AnimatePresence>
      {open && (
        <DialogShell onClose={onClose} titleId={titleId}>
          <motion.div
            variants={modalFadeScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 max-h-[90dvh] w-[calc(100vw-1.5rem)] ${sizeClass} overflow-y-auto rounded-lg border border-[#e4d6b8] bg-white shadow-2xl`}
          >
            <div className="sticky top-0 z-10 flex min-h-16 items-center justify-between gap-4 border-b border-[#eee2c9] bg-white/96 px-5 backdrop-blur">
              <h3 id={titleId} className="text-lg font-bold text-[#211900]">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-[#5f512d] hover:bg-[#f2ead7]"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </DialogShell>
      )}
    </AnimatePresence>
  );
}

export function AdminConfirmDialog({
  open,
  title = "Confirm action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId();

  return (
    <AnimatePresence>
      {open && (
        <DialogShell onClose={onCancel} titleId={titleId}>
          <motion.div
            variants={modalFadeScale}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-[calc(100vw-1.5rem)] max-w-md rounded-lg border border-red-100 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 id={titleId} className="text-lg font-bold text-[#211900]">{title}</h3>
                {message && <p className="mt-2 text-sm leading-6 text-[#695f4c]">{message}</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AdminButton variant="secondary" onClick={onCancel} disabled={loading}>
                {cancelLabel}
              </AdminButton>
              <AdminButton variant="danger" onClick={onConfirm} loading={loading}>
                {confirmLabel}
              </AdminButton>
            </div>
          </motion.div>
        </DialogShell>
      )}
    </AnimatePresence>
  );
}

function DialogShell({ children, onClose, titleId }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <Fragment>
      <motion.button
        type="button"
        className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: motionDurations.micro }}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {children}
      </div>
    </Fragment>
  );
}

export function AdminAuthShell({ title, subtitle, children }) {
  const highlights = [
    "Products, inventory, and pricing",
    "Orders, customize, and business requests",
    "Gallery, users, and contact messages",
  ];

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#181200] px-4 py-10 text-[var(--brand-ink)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-28 top-16 h-72 w-72 rounded-full bg-[#d9a928]/10 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-[#f3c85a]/8 blur-3xl" />
      </div>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/12 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.42)] md:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="relative hidden overflow-hidden bg-[#211900] p-8 text-white md:flex md:flex-col md:justify-between">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,200,90,0.16),transparent_58%)]"
            aria-hidden="true"
          />

          <div className="relative">
            <Image
              src={Logo}
              alt="Khaled El Gamal"
              className="h-[4.5rem] w-auto object-contain"
              priority
            />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#f3c85a]/28 bg-[#f3c85a]/10 px-3 py-1.5">
              <Shield className="h-3.5 w-3.5 text-[#f3c85a]" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#f3c85a]">
                Admin console
              </span>
            </div>
          </div>

          <div className="relative">
            <h1 className="text-3xl font-bold leading-tight">Manage the store with clarity.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/68">
              Products, orders, requests, users, and media in one focused workspace.
            </p>
            <ul className="mt-6 space-y-2.5">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/78">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3c85a]/16 text-[#f3c85a]">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-6 md:hidden">
            <Image
              src={Logo}
              alt="Khaled El Gamal"
              className="h-14 w-auto object-contain"
              priority
            />
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#ead9a5] bg-[#fff7df] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#7a5f07]">
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              Admin console
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--brand-olive)]">
            Secure access
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--brand-ink)] sm:text-[1.75rem]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </motion.section>
    </main>
  );
}

export function AdminField({ label, error, children }) {
  return (
    <label className="block text-sm font-bold text-[#2d250d]">
      {label}
      <div className="mt-1.5">{children}</div>
      <AnimatePresence>
        {error && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-sm font-semibold text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

export const adminInputClass =
  "min-h-11 w-full rounded-lg border border-[#d8ccb3] bg-[#fffdf8] px-3 py-2 text-sm text-[#211900] outline-none transition focus:border-[#c99a20] focus:bg-white focus:ring-4 focus:ring-[#d8aa2e]/18 disabled:cursor-not-allowed disabled:opacity-55";

export function AdminMotionList({ children, className = "", as = "div" }) {
  const Component = motion[as] || motion.div;
  return (
    <Component variants={staggerContainer} initial="hidden" animate="visible" className={className}>
      {children}
    </Component>
  );
}
