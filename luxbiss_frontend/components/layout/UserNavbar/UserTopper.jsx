"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, LogOut, ChevronDown } from "lucide-react";
import RedeemGiftCardModal from "@/components/features/wallet/RedeemGiftCardModal";
import { getImageUrl } from "@/lib/utils";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function UserTopbar({ onMenuClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };


  const name = user?.name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.profile_photo ? getImageUrl(user.profile_photo) : "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* ✅ Mobile menu only */}
          <button
            onClick={onMenuClick}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 active:bg-slate-200"
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

          {/* ✅ Logo for mobile */}
          {/* <div className="flex items-center gap-2 md:hidden">
            <img src="/Logo.svg" alt="Luxbiss Logo" className="h-8 w-8 object-contain" />
            <span className="font-bold text-lg text-slate-900">Luxbiss</span>
          </div> */}

          {/* Optional title on desktop */}
          <div className="hidden md:block text-sm font-semibold text-slate-700 font-['Inter']">
            Dashboard
          </div>
        </div>

        {/* Right Section with Dropdown */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setIsRedeemOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-[12px] md:text-sm font-semibold text-white shadow-sm hover:bg-sky-600 active:bg-sky-700 transition-colors font-['Inter']"
          >
            Redeem Gift Card
          </button>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-100 active:bg-slate-200 transition-all"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center text-xs font-bold text-slate-500">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Avatar online indicator */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#16A34A] ring-2 ring-white border-[1.5px] border-white" />
              </div>

              <div className="hidden sm:block text-left leading-tight">
                <div className="text-sm font-semibold text-[#374151] ">
                  {name}
                </div>
                <div className="text-xs font-medium text-[#374151] ">{email}</div>
              </div>

              <ChevronDown size={18} className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Premium Dropdown Menu */}
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-[240px] bg-white border border-[#E5E7EB] rounded-lg shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)] z-50 overflow-hidden font-['Inter']">
                  {/* Dropdown Header */}
                  <div className="flex flex-row items-center p-4 gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center text-xs font-bold text-slate-500">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] border-[1.5px] border-white rounded-full" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-semibold text-[#374151] leading-6 truncate ">
                        {name}
                      </span>
                      <span className="text-sm font-medium text-[#374151] leading-5 truncate ">
                        {email}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-[1px] bg-[#D1D5DB] self-stretch" />

                  {/* Dropdown Items */}
                  <div className="flex flex-col py-1">
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors group">
                      <User size={20} className="text-[#374151] group-hover:text-sky-500 transition-colors" />
                      <span className="text-sm font-medium text-[#374151] ">Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] transition-colors group w-full text-left"
                    >
                      <LogOut size={20} className="text-[#374151] group-hover:text-rose-500 transition-colors" />
                      <span className="text-sm font-medium text-[#374151] ">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
      <RedeemGiftCardModal
        isOpen={isRedeemOpen}
        onClose={() => setIsRedeemOpen(false)}
      />
    </header>
  );
}
