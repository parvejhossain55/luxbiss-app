"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import { useEffect } from "react";

export default function Sidebar({ open, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { stats, fetchStats } = useAdminDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const go = (href) => {
    router.push(href);
    onClose?.();
  };
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed left-0 z-50 w-64 bg-white border-r
          transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}

          /* ✅ Mobile: full screen */
          top-0 h-dvh

          /* ✅ Desktop: below topbar */
          md:top-14 md:h-[calc(100vh-56px)]
          md:translate-x-0 md:sticky md:z-auto
        `}
      >
        <div className="flex h-full flex-col">
          {/* ✅ Mobile header with close button */}
          <div className="md:hidden flex items-center justify-between px-4 h-14 border-b bg-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative h-6 w-6">
                <span className="absolute left-1/2 top-0 -translate-x-1/2 h-6 w-1.5 rounded-full bg-sky-500" />
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-6 rounded-full bg-sky-500" />
                <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sky-300" />
              </div>
              <span className="font-semibold text-slate-800">Luxbiss</span>
            </div>

            <button
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-slate-200 flex items-center justify-center"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Menu */}
          <nav className="px-4 py-4 space-y-3 overflow-y-auto">
            <NavItem
              active={pathname === "/admin/dashboard"}
              label="Dashboard"
              icon={<IconDashboard />}
              onClick={() => go("/admin/dashboard")}
            />
            <NavItem
              active={pathname === "/admin/products"}
              label="Products"
              icon={<IconList />}
              onClick={() => go("/admin/products")}
            />
            <NavItem
              active={pathname === "/admin/users"}
              label="All User"
              icon={<IconUsers />}
              onClick={() => go("/admin/users")}
            />
            <NavItem
              active={pathname === "/admin/transactions"}
              label="Transactions"
              icon={<IconMoney />}
              onClick={() => go("/admin/transactions")}
            />
            <NavItem
              active={pathname === "/admin/wallet"}
              label="Wallet"
              icon={<IconWallet />}
              onClick={() => go("/admin/wallet")}
            />
            <NavItem
              active={pathname === "/admin/giftcards"}
              label="Gift Cards"
              icon={<IconGift />}
              onClick={() => go("/admin/giftcards")}
            />
            <NavItem
              active={pathname === "/admin/managers"}
              label="Managers"
              icon={<IconUser />}
              onClick={() => go("/admin/managers")}
            />
            <NavItem
              active={pathname === "/admin/ignored-users"}
              label="Ignored Users"
              icon={<IconSettings />}
              onClick={() => go("/admin/ignored-users")}
            />
            <NavItem
              active={pathname === "/admin/transaction-templates"}
              label="Transaction Template"
              icon={<IconTemplate />}
              onClick={() => go("/admin/transaction-templates")}
            />
          </nav>

          {/* Bottom card */}
          <div className="mt-auto px-4 pb-5">
            <div className="w-full rounded-xl border border-sky-200 bg-sky-50 p-3">
              <div className="text-xs font-semibold text-slate-700">
                Total Deposit
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center text-xs">
                  $
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  ${Number(stats?.deposits?.total_amount || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* optional extra close button bottom (mobile) */}
          <button
            onClick={onClose}
            className="md:hidden mx-4 mb-4 h-10 rounded-lg border hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}

/* ----------------------
   Sidebar Parts
---------------------- */
function NavItem({ label, active, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3
        px-1 py-1 text-left
        transition-colors
        ${active ? "text-slate-900" : "text-slate-400 hover:text-slate-600"}
      `}
    >
      <span
        className={`
          inline-flex h-6 w-6 items-center justify-center
          ${active ? "text-slate-900" : "text-slate-400"}
        `}
      >
        {icon}
      </span>
      <span className={`${active ? "font-semibold" : "font-normal"} text-sm`}>
        {label}
      </span>
    </button>
  );
}

function BaseIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
function IconStats() {
  return (
    <BaseIcon>
      <path d="M4 19h16" />
      <path d="M6 17V9" />
      <path d="M12 17V5" />
      <path d="M18 17v-7" />
    </BaseIcon>
  );
}
function IconList() {
  return (
    <BaseIcon>
      <path d="M8 6h12" />
      <path d="M8 12h12" />
      <path d="M8 18h12" />
      <path d="M4 6h.01" />
      <path d="M4 12h.01" />
      <path d="M4 18h.01" />
    </BaseIcon>
  );
}
function IconUsers() {
  return (
    <BaseIcon>
      <path d="M16 11a3 3 0 1 0-6 0" />
      <path d="M2 20c1.5-4 6-6 10-6s8.5 2 10 6" />
      <path d="M7.5 11a3 3 0 1 0-6 0" />
    </BaseIcon>
  );
}
function IconMoney() {
  return (
    <BaseIcon>
      <path d="M12 2v20" />
      <path d="M17 6.5c0-2-2.2-3.5-5-3.5s-5 1.5-5 3.5S9.2 10 12 10s5 1.5 5 3.5S14.8 17 12 17s-5-1.5-5-3.5" />
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
function IconTemplate() {
  return (
    <BaseIcon>
      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </BaseIcon>
  );
}
function IconGift() {
  return (
    <BaseIcon>
      <path d="M4 10h16v10H4z" />
      <path d="M12 10v10" />
      <path d="M4 10V7h16v3" />
      <path d="M9.5 7c-1.5 0-2.5-1-2.5-2s1-2 2.5-1 2.5 3 2.5 3H9.5z" />
      <path d="M14.5 7c1.5 0 2.5-1 2.5-2s-1-2-2.5-1-2.5 3-2.5 3h2.5z" />
    </BaseIcon>
  );
}
function IconUser() {
  return (
    <BaseIcon>
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
      <path d="M4 20c2-4 6-6 8-6s6 2 8 6" />
    </BaseIcon>
  );
}
function IconSettings() {
  return (
    <BaseIcon>
      <path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3z" />
      <path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.3.8a7.7 7.7 0 0 0-1.7-1L15 4H9l-.6 3a7.7 7.7 0 0 0-1.7 1L4.5 7.5l-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.3-.8a7.7 7.7 0 0 0 1.7 1L9 20h6l.5-3a7.7 7.7 0 0 0 1.7-1l2.3.8 2-3.5z" />
    </BaseIcon>
  );
}
function IconSend() {
  return (
    <BaseIcon>
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4z" />
    </BaseIcon>
  );
}
