/**
 * Mock Data for the application
 * Centralized store for static data to be used across components.
 */

export const DASHBOARD_BAR_DATA = [
    { name: "Jan", value: 520 },
    { name: "Feb", value: 260 },
    { name: "Mar", value: 760 },
    { name: "Apr", value: 410 },
    { name: "May", value: 220 },
    { name: "Jun", value: 300 },
];

export const DASHBOARD_AREA_DATA = [
    { m: "Jan", v: 980 },
    { m: "Feb", v: 820 },
    { m: "Mar", v: 960 },
    { m: "Apr", v: 880 },
    { m: "May", v: 1020 },
    { m: "Jun", v: 1100 },
    { m: "Jul", v: 980 },
    { m: "Aug", v: 1260 },
    { m: "Sep", v: 900 },
    { m: "Oct", v: 760 },
    { m: "Nov", v: 940 },
    { m: "Dec", v: 880 },
];

export const RECENT_TRANSACTIONS = [
    {
        id: "#302012",
        date: "1 min ago",
        amount: "$121.00",
        type: "Deposit",
        method: "USDT TRX Tron (TRC20)",
        status: "Processing",
    },
    {
        id: "#302011",
        date: "1 min ago",
        amount: "$590.00",
        type: "Withdraw",
        method: "BTC (Bitcoin)",
        status: "Processing",
    },
    {
        id: "#302002",
        date: "5 hour ago",
        amount: "$125.00",
        type: "Withdraw",
        method: "ETH Ethereum (ERC20)",
        status: "Completed",
    },
    {
        id: "#301901",
        date: "1 day ago",
        amount: "$348.00",
        type: "Withdraw",
        method: "USDT TRX Tron (TRC20)",
        status: "Completed",
    },
    {
        id: "#301900",
        date: "2 day ago",
        amount: "$607.00",
        type: "Withdraw",
        method: "LTC (Litecoin)",
        status: "Completed",
    },
];

export const WALLET_TRANSACTIONS = [
    {
        id: "#302012",
        date: "1 min ago",
        amount: "$121.00",
        type: "Deposit",
        method: "USDT TRX Tron (TRC20)",
        status: "Processing",
    },
    {
        id: "#302011",
        date: "1 min ago",
        amount: "$590.00",
        type: "Withdraw",
        method: "BTC (Bitcoin)",
        status: "Processing",
    },
    {
        id: "#302002",
        date: "5 hour ago",
        amount: "$125.00",
        type: "Withdraw",
        method: "ETH Ethereum (ERC20)",
        status: "Completed",
    },
    {
        id: "#301901",
        date: "1 day ago",
        amount: "$348.00",
        type: "Withdraw",
        method: "USDT TRX Tron (TRC20)",
        status: "Completed",
    },
    {
        id: "#301900",
        date: "2 day ago",
        amount: "$607.00",
        type: "Withdraw",
        method: "LTC (Litecoin)",
        status: "Completed",
    },
];

export const PRODUCT_LEVELS = [
    { label: "Level-01", active: true, locked: false },
    { label: "Level-02", active: false, locked: true },
    { label: "Level-03", active: false, locked: false },
    { label: "Level-04", active: false, locked: true },
    { label: "Level-02", active: false, locked: true },
    { label: "Level-02", active: false, locked: true },
    { label: "Level-03", active: false, locked: false },
    { label: "Level-04", active: false, locked: true },
];

export const WALLET_TYPES = [
    { id: "usdt", name: "USDT TRX Tron", network: "TRC20", color: "#26A17B" },
    { id: "btc", name: "BTC", network: "Bitcoin", color: "#F7931A" },
    { id: "ltc", name: "LTC", network: "Litecoin", color: "#2B53B7" },
    { id: "eth", name: "ETH (Ethereum)", network: "ERC20", color: "#627EEA" },
];

export const ALL_PRODUCTS = [
    { id: 1, title: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, reviews: 88 },
    { id: 2, title: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, reviews: 88 },
    { id: 3, title: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, reviews: 88 },
    { id: 4, title: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, reviews: 88 },
];
