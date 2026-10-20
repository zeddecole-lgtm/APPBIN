import { ArrowDownToLine, ArrowUpFromLine, CandlestickChart, History, LogIn, QrCode, Users, Wallet } from "lucide-react";

export const BINANCE_HOME = "https://www.binance.com/";
export const TELEGRAM = "https://web.telegram.org/k/";

export const BINANCE_LINKS = [
  { label: "Log in", icon: LogIn, url: "https://accounts.binance.com/en/login" },
  { label: "Wallet", icon: Wallet, url: "https://www.binance.com/en/my/wallet/account/overview" },
  { label: "Deposit", icon: ArrowDownToLine, url: "https://www.binance.com/en/my/wallet/account/main/deposit/crypto" },
  { label: "Withdraw", icon: ArrowUpFromLine, url: "https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto" },
  { label: "Markets", icon: CandlestickChart, url: "https://www.binance.com/en/markets/overview" },
  { label: "P2P", icon: Users, url: "https://p2p.binance.com/" },
  { label: "Pay", icon: QrCode, url: "https://www.binance.com/en/my/wallet/account/payment/home" },
  { label: "History", icon: History, url: "https://www.binance.com/en/my/wallet/history/deposit-crypto" },
] as const;

/** Open a website as it is, in a new window (a Chrome tab on top of the app on Android). */
export const openSite = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
