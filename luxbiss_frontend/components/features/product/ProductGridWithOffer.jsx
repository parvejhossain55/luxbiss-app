import React from "react";

export default function ProductGridWithOffer({ products }) {
    return (
        <section className="rounded-2xl border bg-white p-4 md:p-6">
            <div className="text-sm font-semibold text-slate-700">
                All Products Level 01
            </div>

            {/* cards grid */}
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((p) => (
                    <ProductCard key={p.id} p={p} />
                ))}
            </div>

            {/* offer section */}
            <div className="mt-6 max-w-sm">
                <div className="text-lg font-bold text-slate-900">Special Combo Offer</div>
                <div className="mt-1 text-xl font-bold text-slate-900">$192.00</div>

                <div className="mt-4 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-md border overflow-hidden bg-white">
                        <button className="h-9 w-9 hover:bg-slate-50 text-lg leading-none">
                            −
                        </button>
                        <div className="h-9 w-12 flex items-center justify-center text-sm font-semibold">
                            03
                        </div>
                        <button className="h-9 w-9 bg-sky-500 text-white hover:bg-sky-600 text-lg leading-none">
                            +
                        </button>
                    </div>

                    <button className="h-9 px-6 rounded-md bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600">
                        Invest Now
                    </button>
                </div>
            </div>
        </section>
    );
}

function ProductCard({ p }) {
    return (
        <div>
            {/* image box */}
            <div className="rounded-xl bg-slate-100 border h-36 md:h-40 flex items-center justify-center">
                <div className="h-20 w-28 rounded-lg bg-slate-300" />
            </div>

            <div className="mt-2 text-xs md:text-sm font-semibold text-slate-800">
                {p.title}
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs">
                <span className="font-bold text-rose-600">${p.price}</span>
                <span className="text-slate-400 line-through">${p.oldPrice}</span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="text-amber-500">★★★★★</span>
                <span>({p.reviews})</span>
            </div>
        </div>
    );
}
