import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { checkSecret, isDecoyAnswer, setUnlocked } from "@/lib/gate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dodo — Quick Math" },
      { name: "description", content: "A tiny math puzzle. Answer correctly to play." },
      { property: "og:title", content: "Dodo — Quick Math" },
      { property: "og:description", content: "A tiny math puzzle. Answer correctly to play." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Gate,
});

function Gate() {
  const nav = useNavigate();
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const a = answer.trim();
    if (!a) return;
    if (isDecoyAnswer(a)) return nav({ to: "/game" });
    setBusy(true);
    const ok = await checkSecret(a);
    setBusy(false);
    if (ok) {
      setUnlocked(true);
      nav({ to: "/app/home" });
    } else {
      setWrong(true);
      setAnswer("");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <WormLogo />
      <h1 className="mt-6 text-3xl font-semibold">Dodo</h1>
      <p className="mt-2 text-sm text-muted-foreground">Solve to play</p>
      <form onSubmit={submit} className="surface mt-8 w-full p-6">
        <p className="font-display text-4xl font-bold">1 + 1 = ?</p>
        <input value={answer} onChange={(e) => { setAnswer(e.target.value); setWrong(false); }} type="password" autoComplete="off"
          placeholder="Your answer" className="mt-5 w-full rounded-xl border border-input bg-muted px-4 py-3 text-center text-lg outline-none focus:border-ring" />
        {wrong && <p className="mt-2 text-xs text-destructive">Wrong answer, try again.</p>}
        <button disabled={busy} className="bg-gold mt-4 w-full rounded-xl py-3 font-bold text-primary-foreground disabled:opacity-60">
          {busy ? "…" : "Check"}
        </button>
      </form>
    </main>
  );
}

export function WormLogo({ size = 96 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="Dodo logo" className="drop-shadow-lg">
      <rect width="100" height="100" rx="26" className="fill-accent" />
      <path d="M20 65 Q32 40 45 60 T70 55 Q80 52 80 40" fill="none" strokeWidth="11" strokeLinecap="round" className="stroke-primary" />
      <circle cx="80" cy="38" r="3" className="fill-primary-foreground" />
    </svg>
  );
}
