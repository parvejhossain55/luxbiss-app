"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { authService } from "@/lib/auth";

export default function LuxbissForgotPasswordSplit() {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true);
    setError("");

    const email = sessionStorage.getItem("resetPasswordEmail");
    const otp = sessionStorage.getItem("resetPasswordOtp");

    if (!email || !otp) {
      setError("Session expired. Please start over.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.resetPassword(email, otp, newPassword, confirmPassword);
      if (res.success) {
        toast.success("Password reset successfully!");
        sessionStorage.removeItem("resetPasswordEmail");
        sessionStorage.removeItem("resetPasswordOtp");
        router.push("/login");
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT IMAGE + OVERLAY */}
        <LeftShowcase />

        {/* RIGHT CONTENT */}
        <div className="relative flex items-center justify-center bg-[#f9fafc] px-6 py-12 sm:px-10">
          {/* Brand */}
          <div className="absolute left-8 top-8 flex items-center gap-2">
            <PlusLogo />
            <span className="text-[20px] font-semibold text-[#111827]">
              Luxbiss
            </span>
          </div>

          <div className="w-full max-w-[380px]">
            <h1 className="text-center text-[22px] font-extrabold text-[#111827]">
              New Password
            </h1>
            <p className="mt-2 text-center text-[12px] leading-5 text-[#6b7280]">
              Enter your new password below to reset your password.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-[12px] text-red-600 border border-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field
                label="New password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={setNewPassword}
                type="password"
                disabled={isLoading}
              />
              <Field
                label="Confirm password"
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                type="password"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg bg-[#1ea7d8] py-2.5 text-[12px] font-semibold text-white transition 
                  ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1795c2] active:scale-[0.99]"}`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>


            <p className="mt-6 text-center text-[12px] text-[#6b7280]">
              Back to log in page?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-[#2563eb] hover:underline"
              >
                Back now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Left Side (same image + cards) ---------------- */

function LeftShowcase() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src="/image.webp"
        alt="Luxbiss background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative h-full w-full">
        {/* Main card */}
        <div className="absolute left-[12%] top-[31%] w-[360px] rounded-2xl bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.20)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111827]">
                Sales Progress
              </h3>
              <p className="mt-1 text-[12px] text-[#64748b]">This Quarter</p>
            </div>
            <button type="button" className="rounded-md p-1.5 hover:bg-slate-100">
              <DotsIcon />
            </button>
          </div>

          <div className="mt-5 flex justify-center">
            <div className="relative h-[170px] w-[260px]">
              <div className="absolute left-1/2 top-3 h-[220px] w-[220px] -translate-x-1/2 rounded-full border-[14px] border-[#eef2f6] border-b-transparent border-l-transparent border-r-transparent" />
              <div className="absolute left-1/2 top-3 h-[220px] w-[220px] -translate-x-1/2 rotate-[-18deg] rounded-full border-[14px] border-[#1ea7d8] border-b-transparent border-l-transparent border-r-transparent" />

              <div className="absolute left-1/2 top-[66px] -translate-x-1/2 text-center">
                <div className="text-[22px] font-bold text-[#111827]">
                  75.55%
                </div>
                <span className="mt-1 inline-flex items-center rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                  +10%
                </span>
              </div>
            </div>
          </div>

          <p className="-mt-2 text-center text-[12px] text-[#64748b]">
            You succeed earn{" "}
            <span className="font-semibold text-[#111827]">$240</span> today, its
            higher than
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4">
              <p className="text-[11px] text-[#64748b]">Target</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[18px] font-bold text-[#111827]">$20k</p>
                <span className="text-[13px] font-bold text-[#ef4444]">↓</span>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4">
              <p className="text-[11px] text-[#64748b]">Revenue</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[18px] font-bold text-[#111827]">$25k</p>
                <span className="text-[13px] font-bold text-[#16a34a]">↑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small revenue card */}
        <div className="absolute left-[30%] top-[60%] w-[320px] rounded-2xl bg-white p-5 shadow-[0_22px_60px_rgba(0,0,0,0.20)]">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef2ff]">
              <BadgeIcon />
            </div>
            <div>
              <p className="text-[12px] font-medium text-[#64748b]">
                Total Revenue
              </p>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-[20px] font-extrabold text-[#111827]">
                  $75,500
                </p>
                <span className="inline-flex items-center rounded-full bg-[#eaf7ef] px-2 py-0.5 text-[11px] font-semibold text-[#16a34a]">
                  +10%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Field ---------------- */

function Field({ label, placeholder, value, onChange, type = "text", disabled }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-medium text-[#374151]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className={`h-10 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#111827] outline-none placeholder:text-[#b6bfce] focus:border-[#1ea7d8] focus:ring-4 focus:ring-[#1ea7d8]/15 ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
      />
    </div>
  );
}


/* ---------------- Icons ---------------- */

function PlusLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4.5v15M4.5 12h15"
        stroke="#1ea7d8"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="5" r="1.7" fill="#64748b" />
      <circle cx="12" cy="12" r="1.7" fill="#64748b" />
      <circle cx="12" cy="19" r="1.7" fill="#64748b" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        stroke="#6366f1"
        strokeWidth="1.8"
      />
      <path
        d="M8 12l2.2 2.2L16.5 8.9"
        stroke="#6366f1"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}