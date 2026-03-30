"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

export default function LuxbissRegisterSplit() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree to the Terms & Privacy Policy");
      return;
    }

    const res = await register({
      name: fullName,
      email: email,
      password: password,
    });

    if (res.success) {
      toast.success(res.message || "OTP sent to your email");
      // Save email for the verification page
      sessionStorage.setItem("pendingRegistrationEmail", email);
      router.push("/otp-verification?type=registration");
    }
  };


  return (
    <div className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT IMAGE + OVERLAY */}
        <LeftShowcase />

        {/* RIGHT FORM */}
        <div className="relative flex items-center justify-center bg-[#fbfbfe] px-5 py-12 sm:px-10">
          {/* Brand (top-left) */}
          <div className="absolute left-8 top-8 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-[#e8ebf4]">
              <PlusIcon />
            </div>
            <div className="text-[20px] font-semibold text-[#111827]">
              Luxbiss
            </div>
          </div>

          {/* Form container */}
          <div className="w-full max-w-[460px]">
            <h1 className="text-center text-[28px] font-extrabold text-[#111827]">
              Welcome to Luxbiss!
            </h1>
            <p className="mt-2 text-center text-[14px] text-[#6b7280]">
              Register now and start your adventure.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-[12px] text-red-600 border border-red-200">
                {error}
                <button onClick={clearError} className="ml-2 font-bold underline">✕</button>
              </div>
            )}

            {/* Divider */}
            <div className="mx-auto my-8 flex w-full max-w-[520px] items-center gap-4">
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-[520px] space-y-5">
              <Field
                label="Full Name"
                placeholder="Enter your name"
                value={fullName}
                onChange={setFullName}
                type="text"
              />

              <Field
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                type="email"
              />

              {/* Password */}
              <div>
                <label className="mb-2 block text-[13px] font-medium text-[#374151]">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter strong password"
                    type={showPass ? "text" : "password"}
                    className="h-11 w-full rounded-lg border border-[#e6e9f2] bg-white px-4 pr-11 text-[13px] text-[#111827] outline-none placeholder:text-[#a8b0c0] focus:border-[#1ea7d8] focus:ring-4 focus:ring-[#1ea7d8]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#7b8498] hover:bg-[#f2f5ff]"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    <EyeIcon />
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#6b7280]">
                  At least 8 characters, uppercase, lowercase, number and symbol.
                </p>
              </div>

              {/* Checkbox */}
              <label className="flex items-center gap-2 text-[13px] text-[#6b7280]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="h-4 w-4 rounded border-[#cfd6e6]"
                />
                <span>
                  I agree to all the{" "}
                  <a href="#" className="font-semibold text-[#2563eb]">
                    Term
                  </a>{" "}
                  &{" "}
                  <a href="#" className="font-semibold text-[#2563eb]">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Register button */}
              <button
                type="submit"
                disabled={!agree || isLoading}
                className={[
                  "mt-2 w-full rounded-lg py-3 text-[13px] font-semibold text-white transition",
                  agree && !isLoading
                    ? "bg-[#1ea7d8] hover:bg-[#1795c2] active:scale-[0.99]"
                    : "cursor-not-allowed bg-[#8fd3ea]",
                ].join(" ")}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-[#6b7280]">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-[#1ea7d8] underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Left Side ---------------- */

function LeftShowcase() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <img
        src="/image.webp"
        alt="Luxbiss background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay cards - adjusted positions to match screenshot */}
      <div className="relative h-full w-full">
        {/* Main Card */}
        <div className="absolute left-[11%] top-[32%] w-[360px] rounded-2xl bg-white p-6 shadow-[0_22px_60px_rgba(0,0,0,0.20)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111827]">
                Sales Progress
              </h3>
              <p className="mt-1 text-[12px] text-[#64748b]">This Quarter</p>
            </div>
            <button
              type="button"
              className="rounded-md p-1.5 hover:bg-slate-100"
            >
              <DotsIcon />
            </button>
          </div>

          {/* Gauge */}
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

        {/* Revenue card - overlap bottom-right */}
        <div className="absolute left-[30%] top-[62%] w-[320px] rounded-2xl bg-white p-5 shadow-[0_22px_60px_rgba(0,0,0,0.20)]">
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

function Field({ label, placeholder, value, onChange, type }) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-medium text-[#374151]">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        className="h-11 w-full rounded-lg border border-[#e6e9f2] bg-white px-4 text-[13px] text-[#111827] outline-none placeholder:text-[#a8b0c0] focus:border-[#1ea7d8] focus:ring-4 focus:ring-[#1ea7d8]/15"
      />
    </div>
  );
}

/* ---------------- Icons ---------------- */

function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="#1ea7d8"
        strokeWidth="2.6"
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

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}