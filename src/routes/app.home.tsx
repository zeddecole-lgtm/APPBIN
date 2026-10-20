import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Globe } from "lucide-react";
import { BINANCE_HOME, BINANCE_LINKS, openSite } from "@/lib/links";
import { PageHeader } from "@/components/ui-kit";

export const Route = createFileRoute("/app/home")({
  head: () => ({ meta: [{ title: "Binance — Digi Mirror" }] }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <PageHeader title="Binance" right={<img src={`${import.meta.env.BASE_URL}icon-192.png`} alt="" width={36} height={36} className="size-9 rounded-xl" />} />

      <section className="surface-hero p-6">
        <Globe className="size-8 text-primary" />
        <h2 className="mt-3 text-lg font-semibold">Binance website</h2>
        <p className="mt-1 text-sm text-muted-foreground">Opens the official binance.com exactly as it is. Log in there with your own account.</p>
        <button onClick={() => openSite(BINANCE_HOME)}
          className="bg-gold shadow-gold mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-bold text-primary-foreground">
          Open Binance <ExternalLink className="size-4" />
        </button>
      </section>

      <h3 className="mb-3 mt-6 text-sm font-semibold text-muted-foreground">Quick pages</h3>
      <div className="grid grid-cols-2 gap-2.5">
        {BINANCE_LINKS.map((l) => (
          <button key={l.label} onClick={() => openSite(l.url)}
            className="surface flex items-center justify-between p-4 text-sm font-semibold">
            {l.label} <ExternalLink className="size-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-[11px] text-muted-foreground">Digi Mirror · not affiliated with Binance</p>
    </>
  );
}
