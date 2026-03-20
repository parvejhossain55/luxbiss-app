"use client"

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const data = [
  {
    name: "Rodolfo Berube",
    role: "Teacher",
    flag: "🇺🇸",
    img: "/T1.png",
    text:
      "As a teacher, I started with a small investment to create an extra income source. The platform manages everything professionally, and I can easily track my profits from the dashboard. I'm still investing and earning consistently.",
    rating: 5,
  },
  {
    name: "Annabelle Heysen",
    role: "Housewife",
    flag: "🇦🇺",
    img: "/T3.png",
    text:
      "As a homemaker, I wanted to contribute financially without managing a full business. This platform made it possible. I started with a small investment and now I'm earning steady profits from home. It's simple, transparent, and easy to follow.",
    rating: 5,
  },
  {
    name: "Lucas Eisenhower",
    role: "Taxi Driver",
    flag: "🇩🇪",
    img: "/T2.jpg",
    text:
      "As a taxi driver, I don’t have time to run a full business. This platform allows me to invest my savings while they manage everything. I can track my earnings easily, and it has become a reliable extra income source for me.",
    rating: 5,
  },
];

function Stars({ n = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function TestimonialCard({ item }) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white shadow-sm">
      {/* image */}
      <div className="p-4 pb-0">
        <div className="overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={item.name === "Rodolfo Berube"}
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-extrabold text-slate-900">
              {item.name}
            </h3>
            <p className="mt-0.5 text-[12px] text-slate-500">
              {item.role} {item.flag}
            </p>
          </div>
          <Stars n={item.rating} />
        </div>

        <p className="mt-4 text-[12.5px] leading-5 text-slate-600">{item.text}</p>
      </div>
    </div>
  );
}

export default function Testimonial() {
  const [page, setPage] = useState(0);

  // 3 cards per page like screenshot
  const pageSize = 3;

  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < data.length; i += pageSize) out.push(data.slice(i, i + pageSize));
    return out;
  }, []);

  const canPrev = page > 0;
  const canNext = page < pages.length - 1;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-sky-800 sm:text-4xl">
          Trusted by Thousands of Investors
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">
          Real stories from our successful investors that will inspire
          <br className="hidden sm:block" />
          you to make the right decisions
        </p>

        <div className="mt-10 flex items-center gap-4">
          {/* left arrow */}
          <button
            type="button"
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className={[
              "hidden h-10 w-10 items-center justify-center rounded-full border md:flex",
              canPrev
                ? "border-sky-600 text-sky-700 hover:bg-sky-50"
                : "border-slate-200 text-slate-300",
            ].join(" ")}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* cards */}
          <div className="grid flex-1 gap-6 md:grid-cols-3">
            {(pages[page] || []).map((item, idx) => (
              <TestimonialCard key={idx} item={item} />
            ))}
          </div>

          {/* right arrow */}
          <button
            type="button"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className={[
              "hidden h-10 w-10 items-center justify-center rounded-full border md:flex",
              canNext
                ? "border-sky-600 text-sky-700 hover:bg-sky-50"
                : "border-slate-200 text-slate-300",
            ].join(" ")}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* dots */}
        <div className="mt-8 flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={[
                "h-2 rounded-full transition",
                i === page ? "w-10 bg-sky-600" : "w-4 bg-slate-300",
              ].join(" ")}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>

        {/* mobile arrows */}
        <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className={[
              "h-10 w-10 rounded-full border",
              canPrev ? "border-sky-600 text-sky-700" : "border-slate-200 text-slate-300",
            ].join(" ")}
            aria-label="Previous"
          >
            <ChevronLeft className="mx-auto h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className={[
              "h-10 w-10 rounded-full border",
              canNext ? "border-sky-600 text-sky-700" : "border-slate-200 text-slate-300",
            ].join(" ")}
            aria-label="Next"
          >
            <ChevronRight className="mx-auto h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}