import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Plus, Send, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/app/apps")({
  head: () => ({
    meta: [
      { title: "Apps — Digi Mirror" },
      { name: "description", content: "Sign in to Telegram and open your other web apps." },
      { property: "og:title", content: "Apps — Digi Mirror" },
      { property: "og:description", content: "Sign in to Telegram and open your other web apps." },
    ],
  }),
  component: AppsPage,
});

type App = { name: string; url: string };
const KEY = "digi-mirror-apps";
const BUILTIN: App[] = [
  { name: "Binance", url: "https://www.binance.com/" },
  { name: "Telegram Web", url: "https://web.telegram.org/k/" },
];

function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { try { setApps(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ } }, []);
  const save = (a: App[]) => { setApps(a); localStorage.setItem(KEY, JSON.stringify(a)); };

  function add(e: React.FormEvent) {
    e.preventDefault();
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try {
      const parsed = new URL(u);
      if (parsed.protocol !== "https:") throw new Error();
      save([...apps, { name: name.trim() || parsed.hostname, url: parsed.href }]);
      setName(""); setUrl(""); setErr("");
    } catch { setErr("Please enter a valid https:// address."); }
  }

  const Row = ({ a, onDelete }: { a: App; onDelete?: () => void }) => (
    <div className="surface flex items-center gap-3 p-4">
      <div className="grid size-10 place-items-center rounded-full bg-accent font-display text-xs font-bold text-accent-foreground">{a.name.slice(0, 2).toUpperCase()}</div>
      <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{a.name}</p><p className="truncate text-xs text-muted-foreground">{new URL(a.url).hostname}</p></div>
      {onDelete && <button aria-label="Remove" onClick={onDelete} className="p-2 text-destructive"><Trash2 className="size-4" /></button>}
      <a href={a.url} target="_blank" rel="noopener noreferrer" className="p-2 text-primary" aria-label={`Open ${a.name}`}><ExternalLink className="size-4" /></a>
    </div>
  );

  return (
    <>
      <PageHeader title="Apps" />
      <section className="surface-hero p-6">
        <Send className="size-8 text-primary" />
        <h2 className="mt-3 text-lg font-semibold">Telegram</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign in on Telegram's official website with your phone number or a QR code.</p>
        <a href="https://web.telegram.org/k/" target="_blank" rel="noopener noreferrer"
          className="bg-gold shadow-gold mt-5 flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-primary-foreground">
          Log in to Telegram <ExternalLink className="size-4" />
        </a>
      </section>

      <h3 className="mb-3 mt-6 text-sm font-semibold text-muted-foreground">Your apps</h3>
      <div className="space-y-2.5">
        {BUILTIN.map((a) => <Row key={a.url} a={a} />)}
        {apps.map((a, i) => <Row key={a.url + i} a={a} onDelete={() => save(apps.filter((_, j) => j !== i))} />)}
      </div>

      <form onSubmit={add} className="surface mt-4 space-y-2 p-4">
        <p className="text-sm font-semibold">Add a web app</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (e.g. WhatsApp)"
          className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm outline-none focus:border-ring" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Address (e.g. web.whatsapp.com)" required
          className="w-full rounded-xl border border-input bg-muted px-4 py-3 text-sm outline-none focus:border-ring" />
        {err && <p className="text-xs text-destructive">{err}</p>}
        <button className="bg-gold flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-primary-foreground"><Plus className="size-4" /> Add app</button>
      </form>
    </>
  );
}
