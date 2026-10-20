import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { checkSecret, isDecoyAnswer, setUnlocked } from "@/lib/gate";
import { useInstall } from "@/lib/install";
import { SecretInput, Worm } from "@/components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dodo" },
      { name: "description", content: "A tiny worm game. Solve the puzzle to play." },
      { property: "og:title", content: "Dodo" },
      { property: "og:description", content: "A tiny worm game. Solve the puzzle to play." },
    ],
  }),
  component: Gate,
});

function Gate() {
  const nav = useNavigate();
  const install = useInstall();
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [wrong, setWrong] = useState(0);
  const [leaving, setLeaving] = useState(false);

  async function submit() {
    const a = answer.trim();
    if (!a || busy) return;
    if (isDecoyAnswer(a)) return nav({ to: "/game" });
    setBusy(true);
    const ok = await checkSecret(a);
    if (ok) {
      setUnlocked(true);
      setLeaving(true);
      setTimeout(() => nav({ to: "/app/home" }), 420);
    } else {
      setBusy(false);
      setWrong((w) => w + 1);
      setAnswer("");
      try { navigator.vibrate?.(80); } catch { /* ignore */ }
    }
  }

  return (
    <main className={`dodo min-h-dvh ${leaving ? "unlock" : ""}`}>
      <div className="mx-auto flex min-h-dvh max-w-[30rem] flex-col justify-center px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
        <div className="flex-[0.6]" />
        <div className="rise flex flex-col items-center">
          <Worm className="w-[58%] max-w-[15rem]" />
          <h1 className="mt-3 font-play text-[3.5rem] font-extrabold leading-none tracking-tight">Dodo</h1>
          <p className="mt-2 text-[1.1rem] font-medium opacity-60">Solve it to feed the worm</p>
        </div>

        <div key={wrong} className={`dodo-card rise mt-9 p-5 ${wrong ? "shake" : ""}`} style={{ animationDelay: wrong ? "0s" : ".1s" }}>
          <p className="py-2 text-center font-play text-[4.75rem] font-extrabold leading-none tracking-tight">
            1<span className="text-worm"> + </span>1
          </p>
          <label className="sr-only" htmlFor="answer">Your answer</label>
          <SecretInput id="answer" value={answer} onChange={setAnswer} onEnter={submit} placeholder="= ?" autoFocus={wrong > 0}
            className="mt-4 w-full rounded-[1.1rem] bg-lilac px-5 py-[1.05rem] text-center font-play text-[1.6rem] font-bold text-ink outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-ink/15" />
          <button onClick={submit} disabled={busy || !answer.trim()} className="dodo-btn mt-3 w-full py-[1.05rem] text-[1.3rem] disabled:opacity-60">
            {busy ? "Checking…" : "Check answer"}
          </button>
          <p className="mt-3 h-5 text-center text-[0.95rem] font-semibold text-worm" aria-live="polite">{wrong > 0 ? "Not quite. Try again." : ""}</p>
        </div>

        <div className="flex-1" />
        {install.available && (
          <button onClick={install.install} className="dodo-key mx-auto mt-6 flex items-center gap-2 px-5 py-3 text-[1.05rem] font-bold">
            <Download className="size-5" /> Install Dodo
          </button>
        )}
      </div>
    </main>
  );
}
