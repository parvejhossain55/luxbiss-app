import React from "react";

export default function StatCard({ title, value, badge, trend, icon }) {
    const isUp = trend === "up";
    const badgeClass = isUp
        ? "bg-[#E7F4EE] text-[#0D894F]"
        : "bg-[#FDF1E8] text-[#E46A11]";

    return (
        <div className="rounded-xl border border-[#E0E2E7] p-5 flex items-center justify-between bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                    {icon}
                </div>
                <div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">{value}</div>
                </div>
            </div>
            <div className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
                {badge}
            </div>
        </div>
    );
}
