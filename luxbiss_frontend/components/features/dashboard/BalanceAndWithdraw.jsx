import React from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useTransactionStore } from "@/store/useTransactionStore";

/* ──────────────────────────────────────────────────
   Figma "Icon_Vertical" sub-stat card
   shown inside the "4 Col_Wheel" balance card
────────────────────────────────────────────────── */
function SubStatCard({ dotColor, label, value }) {
    return (
        <div
            className="flex-1 flex flex-col gap-2 bg-white border border-[#E0E0E0] rounded-lg p-5"
            style={{ minWidth: 0 }}
        >
            {/* Label row */}
            <div className="flex items-center gap-1">
                {/* Colored square dot */}
                <span
                    className="flex-shrink-0 w-3.5 h-3.5 rounded-sm"
                    style={{ background: dotColor }}
                />
                <span
                    className="text-[16px] font-semibold text-[#616161] leading-6 truncate"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    {label}
                </span>
            </div>

            {/* Value + badge row */}
            <div className="flex items-center gap-2">
                <span
                    className="text-[24px] font-medium text-[#212121] leading-8 tracking-[0.005em]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                >
                    {value}
                </span>
            </div>
        </div>
    );
}

/* ──────────────────────────────────────────────────
   Main Section
────────────────────────────────────────────────── */
export default function BalanceAndWithdraw({ summary, user, isLoading }) {
    const { fetchSummary } = useTransactionStore();

    const chartData =
        summary?.withdraw_report?.slice(-7).map((item) => ({
            name: new Date(item.date).toLocaleDateString(undefined, {
                weekday: "short",
            }),
            value: item.amount,
        })) || [];

    const totalDeposit = summary?.total_deposit ?? 0;
    const totalWithdrawal = summary?.total_withdrawal ?? 0;
    const availableBalance = summary?.available_balance ?? user?.balance ?? 0;
    const holdBalance = user?.hold_balance ?? 0;
    const withdrawableBalance = user?.withdrawable_balance ?? 0;

    return (
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 relative">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1FB0D8]" />
                </div>
            )}

            {/* ── Left: "4 Col_Wheel" Balance Card (Figma spec) ── */}
            <div
                className="xl:col-span-2 bg-white border border-[#E0E0E0] rounded-lg flex flex-col gap-4 p-6"
            >
                {/* ── Row 1: Title + Date Picker ── */}
                <div className="flex items-start justify-between gap-3">
                    <h2
                        className="text-[18px] font-semibold text-[#212121] leading-7"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Current Balance
                    </h2>

                    {/* Figma "Datepicker" pill */}
                    <div className="relative">
                        <select
                            className="appearance-none h-10 pl-3 pr-8 bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg text-[14px] font-medium text-[#616161] leading-5 tracking-[0.005em] outline-none cursor-pointer transition-colors hover:border-[#1FB0D8]"
                            style={{ fontFamily: "Inter, sans-serif" }}
                            onChange={(e) => fetchSummary(parseInt(e.target.value))}
                            defaultValue="7"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                        </select>
                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#616161]"
                            strokeWidth={1.5}
                        />
                    </div>
                </div>

                {/* ── Row 2: Large balance value + subtitle ── */}
                <div className="flex flex-col gap-0.5">
                    <span
                        className="text-[28px] font-bold text-[#1FB0D8] leading-9 tracking-[-0.02em]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        ${Number(availableBalance).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                    <span
                        className="text-[14px] font-normal text-[#757575] leading-5"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        Your Current Deposit Balance
                    </span>
                </div>

                {/* ── Row 3: Sub-stat cards ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Total Deposit */}
                    <SubStatCard
                        dotColor="conic-gradient(from 180deg at 50% 50%, #1FB0D8 0deg, #118FB8 360deg)"
                        label="Total Deposit"
                        value={`$${Number(totalDeposit).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                    />
                    {/* Total Withdraw */}
                    <SubStatCard
                        dotColor="conic-gradient(from 180deg at 50% 50%, #A855F7 0deg, #6B21A8 360deg)"
                        label="Total Withdraw"
                        value={`$${Number(totalWithdrawal).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`}
                    />
                </div>
            </div>

            {/* ── Right: Withdraw report bar chart ── */}
            <div className="rounded-lg border border-[#E0E0E0] bg-white p-5 flex flex-col">
                <div
                    className="text-[14px] font-semibold text-[#212121] leading-5 mb-4"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Last 7 Days Withdraw Report
                </div>
                <div className="flex-1 min-h-[160px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#F1F5F9"
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: "#F8FAFC" }}
                                contentStyle={{
                                    borderRadius: 8,
                                    border: "1px solid #E0E0E0",
                                    fontSize: 12,
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#1FB0D8"
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    );
}
