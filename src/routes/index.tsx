import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { checkSecret, isDecoyAnswer, setUnlocked } from "@/lib/gate";
import { useInstall } from "@/lib/install";
import { Worm } from "@/components/ui-kit";

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
      setWrong((w) => w + 1);
      setAnswer("");
    }
  }

  return (
    <main className="dodo min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.5rem,env(safe-area-inset-top))]">
        <div className="rise flex flex-col items-center pt-6">
          <Worm size={200} />
          <h1 className="mt-2 font-play text-6xl font-extrabold tracking-tight">Dodo</h1>
          <p className="mt-1 text-lg font-medium opacity-60">Solve it to feed the worm</p>
        </div>

        <form onSubmit={submit} key={wrong} className={`dodo-card rise mt-10 p-6 ${wrong ? "shake" : ""}`} style={{ animationDelay: wrong ? "0s" : ".12s" }}>
          <p className="text-center font-play text-[5.5rem] font-extrabold leading-none tracking-tight">
            1<span className="text-worm"> + </span>1
          </p>
          <div className="mt-6 flex gap-3">
            <label className="sr-only" htmlFor="answer">Your answer</label>
            <input id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} type="password"
              autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="= ?" autoFocus={wrong > 0}
              className="min-w-0 flex-1 rounded-[18px] bg-lilac px-5 py-4 text-center font-play text-2xl font-bold text-ink outline-none placeholder:text-ink/35 focus:ring-2 focus:ring-ink/20" />
            <button disabled={busy} className="dodo-btn px-7 text-xl disabled:opacity-70">{busy ? "…" : "Go"}</button>
          </div>
          <p className="mt-3 h-5 text-center text-sm font-semibold text-worm" aria-live="polite">{wrong > 0 ? "Not quite. Try again." : ""}</p>
        </form>

        <div className="flex-1" />
        {install.available && (
          <button onClick={install.install} className="dodo-key mx-auto mt-8 flex items-center gap-2 px-5 py-3 text-base font-bold">
            <Download className="size-5" /> Install Dodo
          </button>
        )}
      </div>
    </main>
  );
}
