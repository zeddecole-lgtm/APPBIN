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

/* ---- Launch state: a short "opening" screen, then the site loads in this same window ---- */
type Launch = { name: string; url: string } | null;
let launching: Launch = null;
const subs = new Set<() => void>();
export const subscribeLaunch = (f: () => void) => (subs.add(f), () => subs.delete(f));
export const getLaunch = () => launching;

/**
 * Opens a website inside the app's own window (not a separate tab).
 * Installed on Android, Chrome keeps it in the Dodo window with a small bar and an ✕ to come back.
 */
export function openSite(url: string, name?: string) {
  launching = { url, name: name ?? new URL(url).hostname.replace(/^www\./, "") };
  subs.forEach((f) => f());
  setTimeout(() => window.location.assign(url), 450);
}

export const iconFor = (url: string) => {
  let host = new URL(url).hostname;
  if (host.endsWith("telegram.org")) host = "telegram.org";
  if (host.endsWith("binance.com")) host = "binance.com";
  return `https://icons.duckduckgo.com/ip3/${host}.ico`;
};
