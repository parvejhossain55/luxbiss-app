// app/components/ProductsYouCanInvestIn.jsx
// Exact grid like your screenshot (8 cards + See All)
// Uses your 8 images from /public root path:
// /PI8.png, /PI6.png, /PI4.png, /PI5.png, /PI3.jpg, /PI2.jpg, /PI7.jpg, /P1.png

import Image from "next/image";

const products = [
  {
    title: "Fashion Accessories",
    invest: "$15-$4000",
    profit: "10%-22%",
    img: "/P1.png",
  },
  {
    title: "Smart Devices",
    invest: "$200-$5000",
    profit: "10%-20%",
    img: "/PI6.png",
  },
  {
    title: "Home Appliances",
    invest: "$30-$9000",
    profit: "10%-25%",
    img: "/PI5.png",
  },
  {
    title: "Fitness Equipment",
    invest: "$25-$7000",
    profit: "10%-15%",
    img: "/PI4.png",
  },
  {
    title: "Beauty",
    invest: "$10-$5000",
    profit: "10%-17%",
    img: "/PI3.jpg",
  },
  {
    title: "Baby & Kids",
    invest: "$20-$3000",
    profit: "10%-22%",
    img: "/PI2.jpg",
  },
  {
    title: "Kitchen & Dining",
    invest: "$10-$4500",
    profit: "10%-28%",
    img: "/PI8.png",
  },
  {
    title: "Office",
    invest: "$30-$9000",
    profit: "10%-25%",
    img: "/PI7.jpg",
  },
];

function ProductCard({ item }) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* image frame */}
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </div>

      <h3 className="mt-4 text-center text-[15px] font-extrabold text-slate-900">
        {item.title}
      </h3>

      <div className="mt-3 space-y-1 text-center text-[12.5px] text-slate-700">
        <div>
          Investment:{" "}
          <span className="font-semibold text-emerald-600">{item.invest}</span>
        </div>
        <div>
          Expected Profit:{" "}
          <span className="font-semibold text-emerald-600">{item.profit}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductInvestment() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-sky-800 sm:text-4xl">
          Products You Can Invest In
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-600">
          Explore a variety of wholesale products available <br className="hidden sm:block" />
          for investment
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.title} item={p} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#products"
            className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            See All
          </a>
        </div>
      </div>
    </section>
  );
}