// app/components/HowItWorks.jsx
// More accurate to your screenshot:
// - Lighter sky background
// - Taller cards + bigger radius
// - Softer shadow
// - Thin BLUE border around card
// - Image container is a smaller white box with light border (not full-width heavy)
// - Bubble colors (1 blue, 2-4 green) with subtle shadow
// Uses: /public/1.jpg /2.jpg /3.jpg /4.png

import Image from "next/image";

const steps = [
  {
    n: 1,
    bubble: "bg-[#0B78C2]", // closer blue
    title: "Create an Account",
    desc: "Sign up for a free account\nin minutes",
    img: "/1.jpg",
  },
  {
    n: 2,
    bubble: "bg-[#2E9E45]", // closer green
    title: "Invest in Products",
    desc: "Browse and invest in listed\nwholesale products",
    img: "/2.jpg",
  },
  {
    n: 3,
    bubble: "bg-[#2E9E45]",
    title: "We Handle Sales &\nDelivery",
    desc: "We manage all sales, Shipping\nand customer service",
    img: "/3.jpg",
  },
  {
    n: 4,
    bubble: "bg-[#2E9E45]",
    title: "Track Earnings",
    desc: "Watch your profits grow on\nyour dashboard",
    img: "/4.png",
  },
];

function StepCard({ step }) {
  return (
    <div className="relative rounded-[22px] border border-sky-200 bg-white px-6 pb-7 pt-10 shadow-[0_10px_30px_rgba(2,132,199,0.10)]">
      {/* number bubble */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <div
          className={[
            "grid h-12 w-12 place-items-center rounded-full text-[15px] font-extrabold text-white",
            "shadow-[0_10px_18px_rgba(0,0,0,0.15)]",
            step.bubble,
          ].join(" ")}
        >
          {step.n}
        </div>
      </div>

      <div className="text-center">
        <h3 className="whitespace-pre-line text-[18px] font-extrabold leading-snug text-slate-900">
          {step.title}
        </h3>
        <p className="mt-2 whitespace-pre-line text-[13px] leading-[18px] text-slate-600">
          {step.desc}
        </p>
      </div>

      {/* image frame (smaller like screenshot) */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-3">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-white">
          <Image
            src={step.img}
            alt={`Step ${step.n}`}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 25vw"
            priority={step.n === 1}
          />
        </div>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <section className="bg-[#EEF7FB] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-[40px] font-extrabold tracking-tight text-[#0C6FA6]">
          How it Works
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-center text-[13px] leading-5 text-slate-600">
          Follow these simple steps to start your business journey and earn a
          <br className="hidden sm:block" />
          share of the profits.
        </p>

        {/* tighter spacing like screenshot */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <StepCard key={s.n} step={s} />
          ))}
        </div>
      </div>
    </section>
  );
}