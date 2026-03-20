import React from "react";
import {
  XCircle,
  CheckCircle2,
  CircleCheck,
  BadgeX,
} from "lucide-react";

const problems = [
  {
    title: "Requires Large Capital",
    icon: "💰",
  },
  {
    title: "Costly Showroom / Office Rent",
    icon: "🏢",
  },
  {
    title: "Don't Know Marketing",
    icon: "📣",
  },
  {
    title: "No Website to Sell Products",
    icon: "🛒",
  },
  {
    title: "Product Sourcing Hassle",
    icon: "📦",
  },
];

const solutions = [
  {
    title: "Our Own Showrooms",
    icon: "🏬",
  },
  {
    title: "Our Own E-commerce Website",
    icon: "🌐",
  },
  {
    title: "We Do The Marketing",
    icon: "📈",
  },
  {
    title: "We Handle Transport & Delivery",
    icon: "🚚",
  },
  {
    title: (
      <>
        You Simply <span className="font-semibold text-sky-700">Invest</span> in Products
      </>
    ),
    icon: "🤝",
  },
];

function ListRow({ leftIcon, text, dashed = true, check = false }) {
  return (
    <div className="flex items-center gap-3 py-4">
      {/* left illustration/icon */}
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
        <span className="text-xl">{leftIcon}</span>
      </div>

      {/* text */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-slate-800">{text}</div>
        {dashed && (
          <div className="mt-3 border-t border-dashed border-sky-200" />
        )}
      </div>

      {/* right check (only for solution list to match screenshot) */}
      {check && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
    </div>
  );
}

export default function Business() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-sky-800 sm:text-3xl">
          Challenges of Starting a Business….
        </h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Problems card */}
          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
            <div className="flex justify-center">
              <div className="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-400 px-4 py-3 text-white shadow-sm">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-semibold">The Problems</span>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {problems.map((item, idx) => (
                <ListRow
                  key={idx}
                  leftIcon={item.icon}
                  text={item.title}
                  dashed={idx !== problems.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Solution card */}
          <div className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm">
            <div className="flex justify-center">
              <div className="flex w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-400 px-4 py-3 text-white shadow-sm">
                <CircleCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">Our Solution</span>
              </div>
            </div>

            <div className="mt-5 divide-y divide-slate-100">
              {solutions.map((item, idx) => (
                <ListRow
                  key={idx}
                  leftIcon={item.icon}
                  text={item.title}
                  dashed={idx !== solutions.length - 1}
                  check
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}