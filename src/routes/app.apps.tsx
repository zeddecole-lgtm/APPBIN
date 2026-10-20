import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hexagon, Minus, Plus, Send, X } from "lucide-react";
import { PageHeader } from "@/components/ui-kit";
import { BINANCE_HOME, TELEGRAM, openSite } from "@/lib/links";

export const Route = createFileRoute("/app/apps")({
  head: () => ({ meta: [{ title: "Apps — Dodo" }] }),
  component: AppsPage,
});

type App = { name: string; url: string };
const KEY = "digi-mirror-apps";
const PALETTE = ["#7C6CF2", "#2BB673", "#F2637E", "#F59E2B", "#20A4C9", "#B565E8", "#E8553D", "#4E7CF5"];
const tint = (s: string) => PALETTE[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length]!;
const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  useEffect(() => { try { setApps(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ } }, []);
  const save = (a: App[]) => { setApps(a); try { localStorage.setItem(KEY, JSON.stringify(a)); } catch { /* ignore */ } };

  const Icon = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
    <span className="grid size-[66px] place-items-center rounded-[22px] font-display text-lg font-bold text-white shadow-[inset_0_-3px_0_rgb(0_0_0/0.15)]" style={{ background: bg }}>{children}</span>
  );
  const Cell = ({ label, onClick, children, onRemove }: { label: string; onClick: () => void; children: React.ReactNode; onRemove?: () => void }) => (
    <div className="relative flex flex-col items-center gap-2">
      <button onClick={onClick} className="transition-transform active:scale-95" aria-label={`Open ${label}`}>{children}</button>
      <span className="w-full truncate text-center text-[12.5px] font-semibold text-secondary-foreground">{label}</span>
      {editing && onRemove && (
        <button onClick={onRemove} aria-label={`Remove ${label}`}
          className="absolute -right-0.5 -top-1.5 grid size-6 place-items-center rounded-full bg-destructive text-white ring-4 ring-background"><Minus className="size-3.5" strokeWidth={3} /></button>
      )}
    </div>
  );

  return (
    <>
      <PageHeader title="Apps" right={apps.length > 0 && (
        <button onClick={() => setEditing((e) => !e)} className={`rounded-full px-4 py-2 text-sm font-bold ${editing ? "btn-gold" : "tile"}`}>{editing ? "Done" : "Edit"}</button>
      )} />

      <div className="grid grid-cols-4 gap-x-3 gap-y-6">
        <Cell label="Binance" onClick={() => openSite(BINANCE_HOME)}><Icon bg="#F0B90B"><Hexagon className="size-7 text-[#1A1406]" strokeWidth={2.4} /></Icon></Cell>
        <Cell label="Telegram" onClick={() => openSite(TELEGRAM)}><Icon bg="#2AABEE"><Send className="size-7" /></Icon></Cell>
        {apps.map((a, i) => (
          <Cell key={a.url + i} label={a.name} onClick={() => (editing ? undefined : openSite(a.url))} onRemove={() => save(apps.filter((_, j) => j !== i))}>
            <Icon bg={tint(a.name)}>{initials(a.name)}</Icon>
          </Cell>
        ))}
        <Cell label="Add" onClick={() => setAdding(true)}>
          <span className="grid size-[66px] place-items-center rounded-[22px] border-2 border-dashed border-white/15 text-muted-foreground"><Plus className="size-7" /></span>
        </Cell>
      </div>

      {apps.length === 0 && (
        <p className="mt-10 text-center text-sm leading-relaxed text-muted-foreground">Add WhatsApp, Gmail or any website you use.<br />Tap a tile and it opens on its official site.</p>
      )}

      {adding && <AddSheet onClose={() => setAdding(false)} onAdd={(a) => { save([...apps, a]); setAdding(false); }} />}
    </>
  );
}

function AddSheet({ onClose, onAdd }: { onClose: () => void; onAdd: (a: App) => void }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  function submit(e: React.FormEvent) {
    e.preventDefault();
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try {
      const p = new URL(u);
      if (p.protocol !== "https:" || !p.hostname.includes(".")) throw new Error();
      onAdd({ name: name.trim() || p.hostname.replace(/^www\./, ""), url: p.href });
    } catch { setErr("Enter a web address like web.whatsapp.com"); }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="sheet-up w-full max-w-md rounded-t-[30px] border-t border-border bg-popover px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add an app</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-muted"><X className="size-5" /></button>
        </div>
        <label className="mb-1.5 block text-sm font-semibold text-muted-foreground" htmlFor="app-url">Web address</label>
        <input id="app-url" autoFocus value={url} onChange={(e) => { setUrl(e.target.value); setErr(""); }} inputMode="url" autoCapitalize="off" placeholder="web.whatsapp.com" className="field" />
        <label className="mb-1.5 mt-4 block text-sm font-semibold text-muted-foreground" htmlFor="app-name">Name</label>
        <input id="app-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="WhatsApp" className="field" />
        <p className="mt-2 h-4 text-xs font-semibold text-destructive">{err}</p>
        <button disabled={!url.trim()} className="btn-gold mt-3 w-full py-4 disabled:opacity-40">Add app</button>
      </form>
    </div>
  );
}
