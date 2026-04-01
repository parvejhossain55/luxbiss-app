import WalletStatCard from "./WalletStatCard";
import FundWithdrawModal from "./FundWithdrawModal";
import RedeemGiftCardModal from "./RedeemGiftCardModal";
import { useState } from "react";
import { useModalStore } from "@/store/useModalStore";

export default function WalletManagementSummary({ summary, isLoading }) {
    const { openDepositModal } = useModalStore();
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [isRedeemOpen, setIsRedeemOpen] = useState(false);
    const formatCurrency = (value) =>
        `$${Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const cards = [
        {
            title: "Total Deposit",
            value: formatCurrency(summary?.total_deposit),
            tone: "sky",
            icon: <IconWallet />
        },
        {
            title: "Total Withdraw",
            value: formatCurrency(summary?.total_withdrawal),
            tone: "emerald",
            icon: <IconCheck />
        },
        {
            title: "Available Balance",
            value: formatCurrency(summary?.available_balance),
            tone: "orange",
            icon: <IconCard />
        },
        {
            title: "Withdrawable Balance",
            value: formatCurrency(summary?.withdrawable_balance),
            tone: "rose",
            icon: <IconClock />
        },
        {
            title: "Hold Balance",
            value: formatCurrency(summary?.hold_balance),
            tone: "sky2",
            icon: <IconHold />
        },
    ];


    return (
        <section className="space-y-4">
            {/* Top row (title + breadcrumb + actions) */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-1">
                <div>
                    <h1 className="text-[24px] font-bold text-[#111827] font-['Plus_Jakarta_Sans']">
                        Wallet Management
                    </h1>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-[#FF4A55] font-medium font-['Plus_Jakarta_Sans']">Dashboard</span>
                        <span className="text-[#9CA3AF] text-xs">›</span>
                        <span className="text-[#9CA3AF] font-medium font-['Plus_Jakarta_Sans']">Wallet</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsWithdrawOpen(true)}
                        className="h-[44px] rounded-xl border border-[#EEEEEE] bg-white px-6 text-sm font-semibold text-[#424242] hover:bg-slate-50 transition-colors font-['Plus_Jakarta_Sans']"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={() => openDepositModal()}
                        className="h-[44px] rounded-xl bg-[#00A3FF] px-6 text-sm font-semibold text-white hover:bg-[#0094E8] inline-flex items-center gap-2 transition-colors font-['Plus_Jakarta_Sans'] shadow-md"
                    >
                        <span className="text-xl leading-none">＋</span>
                        Fund Deposit
                    </button>
                </div>
            </div>

            {isWithdrawOpen ? (
                <FundWithdrawModal
                    isOpen={isWithdrawOpen}
                    onClose={() => setIsWithdrawOpen(false)}
                    availableBalance={summary?.withdrawable_balance || 0}
                />
            ) : null}

            {isRedeemOpen ? (
                <RedeemGiftCardModal
                    isOpen={isRedeemOpen}
                    onClose={() => setIsRedeemOpen(false)}
                />
            ) : null}

            {/* Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((c) => (
                    <WalletStatCard key={c.title} {...c} />
                ))}
            </div>
        </section>
    );
}

/* Icons specifically used here */
function IconWallet() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 7h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
            <path d="M3 9h18" />
            <path d="M16 14h3" />
        </svg>
    );
}
function IconCheck() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}
function IconCard() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16v10H4z" />
            <path d="M4 10h16" />
            <path d="M7 15h4" />
        </svg>
    );
}
function IconClock() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 8v5l3 2" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
        </svg>
    );
}
function IconHold() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16v10H4z" />
            <path d="M8 12h8" />
        </svg>
    );
}
