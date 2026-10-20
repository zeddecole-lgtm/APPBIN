import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Download, KeyRound, Lock, RotateCcw } from "lucide-react";
import { PageHeader, SecretInput } from "@/components/ui-kit";
import { checkSecret, getCustomHash, setCustomHash, setUnlocked, sha } from "@/lib/gate";
import { useInstall } from "@/lib/install";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Dodo" }] }),
  component: SettingsPage,
});

function Row({ icon: Icon, label, hint, onClick, tone, right }: { icon: typeof Lock; label: string; hint?: string; onClick?: () => void; tone?: string; right?: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3.5 px-4 py-3.5 text-left active:bg-secondary ${tone ?? ""}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-muted"><Icon className="size-[18px]" /></span>
      <span className="flex-1"><span className="block text-[1rem] font-semibold">{label}</span>{hint && <span className="text-xs text-muted-foreground">{hint}</span>}</span>
      {right}
    </button>
  );
}

function SettingsPage() {
  const nav = useNavigate();
  const install = useInstall();
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const custom = typeof window !== "undefined" && !!getCustomHash();

  async function submit() {
    if (next.length < 6) return setMsg({ ok: false, t: "Use at least 6 characters." });
    if (next !== again) return setMsg({ ok: false, t: "The new answers don't match." });
    if (next.trim() === "2") return setMsg({ ok: false, t: "“2” opens the game, so it can't be your secret." });
    if (!(await checkSecret(cur))) return setMsg({ ok: false, t: "Current answer is wrong." });
    setCustomHash(await sha(next));
    setCur(""); setNext(""); setAgain("");
    setMsg({ ok: true, t: "Secret answer changed on this phone." });
  }

  async function restore() {
    if (!cur) { setOpen(true); return setMsg({ ok: false, t: "Type your current answer first, then tap Restore." }); }
    if (!(await checkSecret(cur))) return setMsg({ ok: false, t: "Current answer is wrong." });
    setCustomHash(null); setCur("");
    setMsg({ ok: true, t: "Original secret answer is back." });
  }

  return (
    <>
      <PageHeader title="Settings" />

      <h2 className="mb-2 px-1 font-sans text-sm font-bold text-muted-foreground">Secret answer</h2>
      <div className="group-list">
        <Row icon={KeyRound} label="Change secret answer" hint="What you type under 1 + 1 to get in" onClick={() => setOpen((o) => !o)}
          right={<ChevronDown className={`size-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />} />
        {open && (
          <div className="space-y-2.5 p-4">
            <SecretInput value={cur} onChange={setCur} placeholder="Current answer" className="field" />
            <SecretInput value={next} onChange={setNext} placeholder="New answer" className="field" />
            <SecretInput value={again} onChange={setAgain} onEnter={submit} placeholder="New answer again" className="field" />
            {msg && <p className={`px-1 text-sm font-semibold ${msg.ok ? "text-success" : "text-destructive"}`}>{msg.t}</p>}
            <button onClick={submit} className="btn-gold w-full py-3.5">Save new answer</button>
          </div>
        )}
        {custom && <Row icon={RotateCcw} label="Restore original answer" onClick={restore} />}
      </div>

      <h2 className="mb-2 mt-7 px-1 font-sans text-sm font-bold text-muted-foreground">This phone</h2>
      <div className="group-list">
        {install.available && <Row icon={Download} label="Install on home screen" hint="Shows up as Dodo with the worm icon" onClick={install.install} />}
        <Row icon={Lock} label="Lock now" hint="Back to the 1 + 1 screen" tone="text-destructive" onClick={() => { setUnlocked(false); nav({ to: "/", replace: true }); }} />
      </div>

      <p className="mt-8 px-6 text-center text-xs leading-relaxed text-muted-foreground">Nothing leaves this phone. Your answer is checked here, without any server or API.</p>
    </>
  );
}
