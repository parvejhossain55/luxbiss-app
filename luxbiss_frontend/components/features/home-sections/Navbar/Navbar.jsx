"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "#products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Earnings", href: "#earnings" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  return (
    <header className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-sky-50 to-white" />
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-[520px] -translate-x-1/2 rounded-full bg-sky-100/60 blur-2xl" />

        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
              <span className="relative h-4 w-4">
                <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-slate-900" />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-slate-900" />
                <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-slate-900" />
              </span>
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
                  onClick={() => setActive(item.label)}
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
              className="inline-flex items-center justify-center rounded-xl bg-black p-2 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={[
            "md:hidden",
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
            "transition-opacity",
          ].join(" ")}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/30"
          />

          <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.label;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => {
                      setActive(item.label);
                      setOpen(false);
                    }}
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