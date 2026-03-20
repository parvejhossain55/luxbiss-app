"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminNavbar({ onMenuClick }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  return (
    <header className="w-full bg-white border-b sticky top-0 z-50">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-7 w-7">
              <span className="absolute left-1/2 top-0 -translate-x-1/2 h-7 w-1.5 rounded-full bg-sky-500" />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-7 rounded-full bg-sky-500" />
              <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sky-300" />
            </div>
            <span className="text-lg font-semibold text-slate-800">
              Luxbiss
            </span>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <IconButton ariaLabel="Settings">
            <GearIcon />
          </IconButton>

          <IconButton ariaLabel="Notifications">
            <BellIcon />
          </IconButton>

          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            aria-label="Logout"
            className="text-slate-800 hover:text-slate-900 active:scale-95 transition"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, ariaLabel }) {
  return (
    <button
      aria-label={ariaLabel}
      className="text-slate-800 hover:text-slate-900 active:scale-95 transition"
    >
      {children}
    </button>
  );
}

/* Icons */
function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      <path d="M19.4 15a7.8 7.8 0 0 0 .1-2l2-1.5-2-3.5-2.2.8a7.6 7.6 0 0 0-1.7-1L15 4H9l-.6 3a7.6 7.6 0 0 0-1.7 1L4.5 7.5l-2 3.5 2 1.5a7.8 7.8 0 0 0 .1 2l-2 1.5 2 3.5 2.2-.8a7.6 7.6 0 0 0 1.7 1L9 20h6l.6-3a7.6 7.6 0 0 0 1.7-1l2.2.8 2-3.5z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </svg>
  );
}