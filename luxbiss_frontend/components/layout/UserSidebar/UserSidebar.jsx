"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Send } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { getImageUrl } from "@/lib/utils";

export default function UserSidebar({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const go = (href) => {
    router.push(href);
    onClose?.(); // close sidebar on mobile after click
  };

  const manager = user?.manager;
  const defaultManagerUsername = "Caro_Lxbiss";
  const managerName = manager?.name || "Caroline Knight";
  const managerPhoto = manager?.profile_photo ? getImageUrl(manager.profile_photo) : "/Manager.jpg";
  const managerTelegram = `@${(manager?.telegram_username || defaultManagerUsername).replace(/^@/, "")}`;
  const managerTelegramLink = `https://t.me/${(manager?.telegram_username || defaultManagerUsername).replace(/^@/, "")}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed left-0 top-0 z-[60] w-72 bg-white border-r
          h-dvh
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}

          md:translate-x-0 md:sticky md:top-0 md:h-dvh md:z-auto
        `}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-4 border-b">
            <div className="h-9 w-9 flex items-center justify-center">
              <img src="/Logo.svg" alt="Luxbiss Logo" className="h-full w-full object-contain" />
            </div>

            <div className="font-semibold text-lg">Luxbiss</div>

            {/* Close (mobile) */}
            <button
              onClick={onClose}
              className="ml-auto md:hidden h-9 w-9 rounded-lg hover:bg-slate-100 active:bg-slate-200 flex items-center justify-center text-xl"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Menu */}
          <nav className="p-4 space-y-2 overflow-y-auto">
            <NavItem
              label="Dashboard"
              icon={<IconDashboard />}
              active={pathname === "/dashboard"}
              onClick={() => go("/dashboard")}
            />

            <NavItem
              label="Profile"
              icon={<IconProfile />}
              active={pathname === "/profile"}
              onClick={() => go("/profile")}
            />

            <NavItem
              label="Products"
              icon={<IconBag />}
              active={pathname === "/product"}
              onClick={() => go("/product")}
            />

            <NavItem
              label="Wallet Management"
              icon={<IconWallet />}
              active={pathname === "/wallet"}
              onClick={() => go("/wallet")}
            />

          </nav>


          {/* Bottom Navigation Sections */}
          <div className="mt-auto p-4 space-y-4">

            {/* Personal Manager Card ("Log out" section in Figma) */}
            <div className="w-[228px] h-[171px] bg-[#EEF0F3] border border-[#BAC2CE] rounded-lg mx-auto flex flex-col items-center justify-center gap-1.5 p-3">
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 rounded-full border-[1.12px] border-[#118FB8] overflow-hidden bg-white">
                    {managerPhoto ? (
                      <img
                        src={managerPhoto}
                        alt={managerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center text-lg font-bold text-slate-500">
                        {managerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {/* Status Indicator (Ellipse 5) */}
                  <div className="absolute top-[51px] left-[46px] w-[12px] h-[12px] bg-[#29FE1D] border-[0.5px] border-[#2196F3] rounded-full" />
                </div>

                <div className="text-center mt-1">
                  <div className="text-[16px] font-semibold text-black leading-5 font-['Inter']">{managerName}</div>
                  <div className="text-[12px] font-normal text-black leading-4 font-['Inter'] opacity-90 tracking-wider">Personal Manager</div>
                </div>
              </div>

              {/* Telegram Button (Primary Button) */}
              <a
                href={managerTelegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-[134px] h-[36px] bg-[#1FB0D8] rounded-[4px] flex items-center justify-center gap-1 text-white transition-all mt-1 hover:brightness-110 active:scale-95"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Send size={16} fill="white" className="rotate-[-15deg] translate-y-[-1px]" />
                </div>
                <span className="text-[14px] font-semibold font-['Inter']">{managerTelegram}</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}


function NavItem({ label, active, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        h-12 px-4 rounded-xl
        text-sm font-semibold
        transition-all duration-200
        ${active
          ? "bg-sky-500 text-white shadow-sm"
          : "text-slate-700 hover:bg-slate-100"
        }
      `}
    >
      <span
        className={`
          inline-flex h-6 w-6 items-center justify-center
          ${active ? "text-white" : "text-slate-500"}
        `}
      >
        {icon}
      </span>

      <span className="truncate">{label}</span>
    </button>
  );
}

/* Icons */
function BaseIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function IconDashboard() {
  return (
    <BaseIcon>
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 13h7v7h-7z" />
    </BaseIcon>
  );
}

function IconBag() {
  return (
    <BaseIcon>
      <path d="M6 7h12l-1 14H7L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </BaseIcon>
  );
}

function IconWallet() {
  return (
    <BaseIcon>
      <path d="M4 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
      <path d="M4 7V6a2 2 0 0 1 2-2h12" />
      <path d="M16 13h3" />
    </BaseIcon>
  );
}

function IconProfile() {
  return (
    <BaseIcon>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </BaseIcon>
  );
}
