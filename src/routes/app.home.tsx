import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, ChevronRight, Lock } from "lucide-react";
import { BINANCE_HOME, BINANCE_LINKS, TELEGRAM, openSite } from "@/lib/links";
import { setUnlocked } from "@/lib/gate";
import { AppIcon } from "@/components/ui-kit";

export const Route = createFileRoute("/app/home")({
  head: () => ({ meta: [{ title: "Dodo" }] }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomePage() {
  const nav = useNavigate();
  return (
    <>
      <header className="flex items-center justify-between pb-6 pt-3">
        <div>
          <p className="text-[0.95rem] font-semibold text-muted-foreground">{greeting()}</p>
          <h1 className="mt-0.5 text-[1.75rem] font-semibold">Your vault</h1>
        </div>
        <button aria-label="Lock now" onClick={() => { setUnlocked(false); nav({ to: "/", replace: true }); }}
          className="tile grid size-[3rem] place-items-center !rounded-full"><Lock className="size-5" /></button>
      </header>

      <button onClick={() => openSite(BINANCE_HOME, "Binance")}
        className="rise relative block w-full overflow-hidden rounded-[1.9rem] bg-primary p-6 text-left text-primary-foreground transition-transform active:scale-[.98]">
        <svg className="pointer-events-none absolute -right-10 -top-12 size-56 opacity-[.13]" viewBox="0 0 100 100" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="7">
            <rect x="28" y="28" width="44" height="44" transform="rotate(45 50 50)" />
            <rect x="40" y="40" width="20" height="20" transform="rotate(45 50 50)" />
          </g>
        </svg>
        <div className="flex items-center gap-3">
          <AppIcon url={BINANCE_HOME} name="Binance" size="2.75rem" />
          <p className="text-[0.95rem] font-bold opacity-75">Official website</p>
        </div>
        <p className="mt-8 font-display text-[2.6rem] font-bold leading-none tracking-tight">Binance</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p className="text-[1rem] font-semibold leading-snug opacity-80">Opens inside the app. Sign in with your own account.</p>
          <span className="grid size-[3.5rem] shrink-0 place-items-center rounded-full bg-primary-foreground text-primary"><ArrowUpRight className="size-6" strokeWidth={2.5} /></span>
        </div>
      </button>

      <h2 className="mb-3 mt-8 font-sans text-[1.05rem] font-bold">Go straight to</h2>
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {BINANCE_LINKS.map(({ label, icon: Icon, url }) => (
          <button key={label} onClick={() => openSite(url, `Binance ${label}`)} className="group flex flex-col items-center gap-2">
            <span className="tile grid aspect-square w-full max-w-[4.1rem] place-items-center group-active:scale-95"><Icon className="size-[1.45rem] text-accent-foreground" /></span>
            <span className="text-[0.8rem] font-semibold text-secondary-foreground">{label}</span>
          </button>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-sans text-[1.05rem] font-bold">Messages</h2>
      <button onClick={() => openSite(TELEGRAM, "Telegram")} className="tile flex w-full items-center gap-4 p-4 text-left">
        <AppIcon url={TELEGRAM} name="Telegram" size="3.1rem" />
        <span className="min-w-0 flex-1"><span className="block text-[1.05rem] font-bold">Telegram</span><span className="text-[0.9rem] text-muted-foreground">Log in with your phone number</span></span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>
    </>
  );
}
