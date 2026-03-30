"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "#products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Earnings", href: "#earnings" },
  { label: "About Us", href: "/about" },
];

const SECTION_LABELS = {
  "#products": "Products",
  "#how-it-works": "How It Works",
  "#earnings": "Earnings",
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const normalizedPathname = pathname?.replace(/\/+$/, "") || "/";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    const syncActiveItem = () => {
      if (normalizedPathname === "/about") {
        setActive("About Us");
        return;
      }

      if (normalizedPathname !== "/") {
        setActive("");
        return;
      }

      setActive(SECTION_LABELS[window.location.hash] || "Home");
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);

    return () => window.removeEventListener("hashchange", syncActiveItem);
  }, [normalizedPathname]);

  const handleNavClick = (event, item) => {
    event.preventDefault();
    setActive(item.label);

    if (!item.href.startsWith("#")) {
      router.push(item.href);
      setOpen(false);
      return;
    }

    if (normalizedPathname !== "/") {
      router.push(`/${item.href}`);
      setOpen(false);
      return;
    }

    const section = document.querySelector(item.href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", item.href);
    }

    setOpen(false);
  };

  return (
    <header className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-sky-50 to-white" />
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-2xl" />

        <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
          {/* Logo */}
          <a href="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <Image
                src="/Logo.svg"
                alt="Lux Biss logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                priority
              />
            </span>

            <span className="text-lg font-extrabold tracking-wide text-sky-600">
              LUX <span className="text-sky-500">BISS</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item)}
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-sky-600"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* ✅ FIXED: use routes instead of #hash */}
            <Link
              href="/login"
              className="hidden rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 md:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/registration"
              className="hidden rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 md:inline-flex"
            >
              Sign Up
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={[
            "md:hidden",
            open ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className={[
              "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <div
            className={[
              "fixed inset-x-4 top-20 z-50 origin-top transform rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 transition-all duration-300",
              open ? "scale-100 opacity-100" : "scale-95 opacity-0",
            ].join(" ")}
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.label;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(event) => handleNavClick(event, item)}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-sky-50 text-sky-700"
                        : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {item.label}
                  </a>
                );
              })}

              {/* Mobile links (already correct) */}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Login
              </Link>

              <Link
                href="/registration"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
