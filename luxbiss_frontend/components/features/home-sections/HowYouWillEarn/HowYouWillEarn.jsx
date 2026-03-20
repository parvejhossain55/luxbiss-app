// app/components/HowYouWillEarn.jsx
// Re-made to match your screenshot more closely:
// - White background (no tint)
// - Same blue title color
// - Thin gray circle border
// - Labels INSIDE circles at bottom
// - Curved-style arrow look (simple, but color-accurate): blue then green
// - Bullet/check list left-aligned under the flow (like screenshot)

import Image from "next/image";
import { Check } from "lucide-react";

const flow = [
  { title: "Your Investment", img: "/HE1.png" },
  { title: "Product Sales", img: "/HE2.png" },
  { title: "Profit Share", img: "/HE3.png" },
];

const points = [
  "The more you invest, The more you can earn",
  "You earn a share of the profits made from sales of the products you invest in",
  "All earnings are shown in real-time on your dashboard",
];

function CircleCard({ title, img }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative grid h-44 w-44 place-items-center rounded-full border border-slate-300 bg-white">
        <div className="relative h-28 w-28">
          <Image
            src={img}
            alt={title}
            fill
            className="object-contain"
            sizes="176px"
            priority={title === "Your Investment"}
          />
        </div>

        {/* label INSIDE circle bottom */}
        <div className="absolute bottom-3 left-1/2 w-full -translate-x-1/2 text-center text-[13px] font-semibold text-slate-900">
          {title}
        </div>
      </div>
    </div>
  );
}

function ArrowSvg({ variant = "blue" }) {
  // blue for first, green for second
  const stroke = variant === "green" ? "#5CB85C" : "#3BA1D6";
  const fill = stroke;

  return (
    <div className="hidden sm:block">
      <svg width="92" height="36" viewBox="0 0 92 36" fill="none" aria-hidden="true">
        {/* slightly curved line */}
        <path
          d="M4 18 C 28 6, 56 6, 72 18"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* arrow head */}
        <path
          d="M72 6 L 90 18 L 72 30 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export default function HowYouWillEarn() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-[#0C6FA6] sm:text-4xl">
          How You Will Earn
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-600">
          See how your earnings are determined based on <br className="hidden sm:block" />
          your investment
        </p>

        {/* Flow row */}
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <CircleCard title={flow[0].title} img={flow[0].img} />
          <ArrowSvg variant="blue" />
          <CircleCard title={flow[1].title} img={flow[1].img} />
          <ArrowSvg variant="green" />
          <CircleCard title={flow[2].title} img={flow[2].img} />
        </div>

        {/* Bullets (left aligned under row like screenshot) */}
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {points.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-emerald-600">
                <Check className="h-3.5 w-3.5 text-white" />
              </span>
              <p className="text-sm text-slate-800">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}