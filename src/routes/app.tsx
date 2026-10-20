import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, LayoutGrid, Settings } from "lucide-react";
import { isUnlocked } from "@/lib/gate";

export const Route = createFileRoute("/app")({ component: AppShell });

const TABS = [
  { to: "/app/home", label: "Binance", icon: Globe },
  { to: "/app/apps", label: "Apps", icon: LayoutGrid },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function AppShell() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (isUnlocked()) setOk(true);
    else nav({ to: "/", replace: true });
  }, [nav]);
  if (!ok) return null;
  return (
    <div className="mx-auto min-h-screen max-w-md px-5 pb-32 pt-6">
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Outlet />
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="surface flex justify-between px-2 py-2 backdrop-blur">
          {TABS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className="flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold text-muted-foreground transition-colors"
              activeProps={{ className: "text-primary bg-accent/60" }}>
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
