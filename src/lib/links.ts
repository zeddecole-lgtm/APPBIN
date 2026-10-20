export const BINANCE_HOME = "https://www.binance.com/";

export const BINANCE_LINKS = [
  { label: "Log in", url: "https://accounts.binance.com/en/login" },
  { label: "Wallet", url: "https://www.binance.com/en/my/wallet/account/overview" },
  { label: "Deposit", url: "https://www.binance.com/en/my/wallet/account/main/deposit/crypto" },
  { label: "Withdraw", url: "https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto" },
  { label: "Markets", url: "https://www.binance.com/en/markets/overview" },
  { label: "P2P", url: "https://p2p.binance.com/" },
  { label: "Pay", url: "https://www.binance.com/en/my/wallet/account/payment/home" },
  { label: "History", url: "https://www.binance.com/en/my/wallet/history/deposit-crypto" },
] as const;

export const TELEGRAM = "https://web.telegram.org/k/";

/** Open a website as it is, in a new window (Chrome tab when installed on Android). */
export const openSite = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
