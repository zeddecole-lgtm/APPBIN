import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Hexagon, LayoutGrid, Settings2 } from "lucide-react";
import { isUnlocked } from "@/lib/gate";

export const Route = createFileRoute("/app")({ component: AppShell });

const TABS = [
  { to: "/app/home", label: "Binance", icon: Hexagon },
  { to: "/app/apps", label: "Apps", icon: LayoutGrid },
  { to: "/app/settings", label: "Settings", icon: Settings2 },
] as const;

function setThemeColor(c: string) {
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c);
}

function AppShell() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!isUnlocked()) return void nav({ to: "/", replace: true });
    setOk(true);
    setThemeColor("#131418");
    return () => setThemeColor("#ECE8FF");
  }, [nav]);
  if (!ok) return null;
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-[30rem] px-5 pb-36 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <Outlet />
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[30rem] px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-1 rounded-[26px] border border-border bg-[#1C1D22]/90 p-1.5 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.7)] backdrop-blur-xl">
          {TABS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className="flex flex-1 items-center justify-center gap-2 rounded-[20px] py-[0.8rem] text-[0.85rem] font-bold text-muted-foreground transition-colors"
              activeProps={{ className: "!bg-primary !text-primary-foreground" }}>
              <Icon className="size-[18px]" strokeWidth={2.4} />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
