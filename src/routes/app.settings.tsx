import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, LogOut } from "lucide-react";
import { PageHeader } from "@/components/ui-kit";
import { checkSecret, setCustomHash, setUnlocked, sha } from "@/lib/gate";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Digi Mirror" },
      { name: "description", content: "Change the secret answer that unlocks Digi Mirror." },
      { property: "og:title", content: "Settings — Digi Mirror" },
      { property: "og:description", content: "Change the secret answer that unlocks Digi Mirror." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const nav = useNavigate();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const field = "w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm outline-none focus:border-ring";

  const verifyCurrent = () => checkSecret(cur);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) return setMsg({ ok: false, t: "The new password needs at least 6 characters." });
    if (next !== again) return setMsg({ ok: false, t: "The two new passwords don't match." });
    if (next.trim() === "2") return setMsg({ ok: false, t: "\"2\" is reserved for the game." });
    if (!(await verifyCurrent())) return setMsg({ ok: false, t: "Current password is wrong." });
    setCustomHash(await sha(next));
    setCur(""); setNext(""); setAgain("");
    setMsg({ ok: true, t: "Password changed on this device." });
  }

  async function reset() {
    if (!(await verifyCurrent())) return setMsg({ ok: false, t: "Enter your current password first." });
    setCustomHash(null);
    setCur("");
    setMsg({ ok: true, t: "Back to your original password." });
  }

  return (
    <>
      <PageHeader title="Settings" />
      <form onSubmit={submit} className="surface space-y-3 p-5">
        <div className="flex items-center gap-3"><KeyRound className="size-5 text-primary" /><h2 className="text-base font-semibold">Change secret password</h2></div>
        <p className="text-xs text-muted-foreground">This is the answer you type under "1 + 1 = ?" to open the real app.</p>
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="Current password" className={field} />
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="New password" className={field} />
        <input type="password" value={again} onChange={(e) => setAgain(e.target.value)} placeholder="Repeat new password" className={field} />
        {msg && <p className={`text-xs ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.t}</p>}
        <button className="bg-gold w-full rounded-xl py-3 text-sm font-bold text-primary-foreground">Save new password</button>
        <button type="button" onClick={reset} className="w-full py-2 text-xs font-semibold text-muted-foreground">Restore original password</button>
      </form>
      <button onClick={() => { setUnlocked(false); nav({ to: "/", replace: true }); }}
        className="surface mt-4 flex w-full items-center justify-between p-4 text-sm font-semibold text-destructive">
        Lock app <LogOut className="size-4" />
      </button>
      <p className="mt-6 text-center text-[11px] text-muted-foreground">Works offline · no API · your password stays on this device</p>
    </>
  );
}
