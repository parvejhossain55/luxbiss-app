// app/components/StartInvestingCTA.jsx
// Updated to use your image from /public/IP.png

import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";

const points = [
  "Diversify your investments with high-demand products",
  "Earn passive income with minimal effort",
  "Join thousands of successful investors",
];

export default function StartInvestingCTA() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-center text-3xl font-extrabold text-[#0C6FA6] sm:text-4xl">
          Start Investing in Wholesale Products Today
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-600">
          Invest and watch your money grow with wholesale
          <br className="hidden sm:block" />
          products.
        </p>

        {/* Inner bordered box */}
        <div className="mt-10 rounded-2xl border border-sky-200 bg-white px-6 py-8 sm:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left content */}
            <div>
              <ul className="space-y-3">
                {points.map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-600">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <a
                  href="#join"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
                >
                  Join Now &amp; Start investing <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <p className="mt-3 text-[12px] text-slate-600">
                Don't miss out — Start investing in wholesale products now!
              </p>
            </div>

            {/* Right image */}
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
                <div className="relative aspect-[16/7] w-full">
                  <Image
                    src="/IP.png"
                    alt="Start investing illustration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 420px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}