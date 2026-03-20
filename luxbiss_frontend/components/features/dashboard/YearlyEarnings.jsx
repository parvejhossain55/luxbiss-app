import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

export default function YearlyEarnings({ data }) {
    return (
        <section className="rounded-2xl border border-[#E0E2E7] bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-[18px] leading-[28px] font-medium text-[#333843] font-['Inter']">Yearly Earnings</div>
                    <div className="text-xs text-slate-500 mt-1">Check your revenue growth over the year</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                        <span className="text-xs text-slate-600">Revenue</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ left: -20, right: 0, top: 10 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1FB0D8" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#1FB0D8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F3" />
                        <XAxis
                            dataKey="m"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#667085' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#667085' }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E0E2E7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="v"
                            stroke="#1FB0D8"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
