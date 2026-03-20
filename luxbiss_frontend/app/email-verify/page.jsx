"use client";

import React from "react";

export default function EmailVerification({ email = "abcdef@gmail.com" }) {
  return (
    <div className="min-h-screen w-full bg-[#edf8fc] relative">
      
      {/* Top Logo */}
          <div> 
        <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <a href="#home" className="group flex items-center gap-2">
            {/* Simple icon to match the vibe (replace with your SVG if you have one) */}
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

       
        </nav>
        </div>


      {/* Center Card */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="w-full max-w-[600px] rounded-2xl bg-white px-6 py-8 text-center sm:px-10"
          style={{
            boxShadow:
              "0 14px 35px rgba(17, 143, 184, 0.18), 0 6px 14px rgba(0,0,0,0.08)",
          }}
        >
          <p className="text-[14px] text-[#1f2937]">
            We have sent a verification link to{" "}
            <span className="font-semibold text-black">{email}</span>
          </p>

          <p className="mt-2 text-[14px] text-[#1f2937]">
            Please click it to continue.
          </p>

          <p className="mt-4 text-[13px] text-[#4b5563]">
            Make sure to check your spam folder in case you have a bad email provider.
          </p>

          <p className="mt-4 text-[13px] font-medium text-[#1f2937]">
            The link is valid for 15 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Logo SVG */
function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64">
      <path
        d="M14 44c6-10 14-14 18-14s12 4 18 14"
        fill="none"
        stroke="#118fb8"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="22" r="6" fill="#000" />
      <circle cx="40" cy="22" r="6" fill="#000" />
    </svg>
  );
}