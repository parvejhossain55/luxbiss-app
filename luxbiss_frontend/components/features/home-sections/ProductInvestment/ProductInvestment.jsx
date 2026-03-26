// app/components/ProductsYouCanInvestIn.jsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const products = [
  {
    title: "Fashion Accessories",
    invest: "$15-$4000",
    profit: "10%-22%",
    img: "/P1.webp",
  },
  {
    title: "Smart Devices",
    invest: "$200-$5000",
    profit: "10%-20%",
    img: "/P2.webp",
  },
  {
    title: "Home Appliances",
    invest: "$30-$9000",
    profit: "10%-25%",
    img: "/P3.webp",
  },
  {
    title: "Fitness Equipment",
    invest: "$25-$7000",
    profit: "10%-15%",
    img: "/P4.webp",
  },
  {
    title: "Beauty",
    invest: "$10-$5000",
    profit: "10%-17%",
    img: "/P5.webp",
  },
  {
    title: "Baby & Kids",
    invest: "$20-$3000",
    profit: "10%-22%",
    img: "/P6.webp",
  },
  {
    title: "Kitchen & Dining",
    invest: "$10-$4500",
    profit: "10%-28%",
    img: "/P7.webp",
  },
  {
    title: "Office",
    invest: "$30-$9000",
    profit: "10%-25%",
    img: "/P8.webp",
  },
];

function ProductCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[304px] w-full flex-col items-center gap-2 rounded-2xl border border-[#A5E1F5] bg-white p-4 text-left transition hover:shadow-[0_8px_24px_rgba(14,116,144,0.08)]"
    >
      <div className="h-[168px] w-full overflow-hidden rounded-lg">
        <div className="relative h-full w-full">
          <Image
            src={item.img}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 208px"
          />
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col items-center gap-5">
        <h3 className="w-full text-center font-['Inter'] text-[20px] font-semibold leading-6 text-black">
          {item.title}
        </h3>

        <div className="flex w-full flex-col items-start justify-center gap-3 font-['Inter'] text-[16px] font-light leading-5 text-black">
          <div className="w-full">
            Investment:{" "}
            <span className="font-normal text-[#119a1f]">{item.invest}</span>
          </div>
          <div className="w-full">
            Expected Profit:{" "}
            <span className="font-normal text-[#119a1f]">{item.profit}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ProductInvestment() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handleProductAccess = () => {
    if (isAuthenticated || user) {
      router.push("/product");
      return;
    }

    router.push("/login?redirect=%2Fproduct");
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-extrabold text-[#0C6FA6] sm:text-4xl">
          Products You Can Invest In
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-600">
          Explore a variety of wholesale products available <br className="hidden sm:block" />
          for investment
        </p>

        <div className="mt-10 grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.title} item={p} onClick={handleProductAccess} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleProductAccess}
            className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
          >
            See All
          </button>
        </div>
      </div>
    </section>
  );
}
