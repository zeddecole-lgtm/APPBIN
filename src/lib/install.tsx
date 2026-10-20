import { useEffect, useSyncExternalStore } from "react";
import { Globe, Share, SquarePlus, X } from "lucide-react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: BIPEvent | null = null;
let sheetOpen = false;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => (subs.add(f), () => subs.delete(f));

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BIPEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true);
const isIOS = () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

/** Install state: hidden when the app already runs from the home screen. */
export function useInstall() {
  const snap = useSyncExternalStore(
    subscribe,
    () => `${!!deferred}|${sheetOpen}|${isStandalone()}`,
    () => "false|false|true",
  );
  const [ready, open, standalone] = snap.split("|").map((v) => v === "true");
  return {
    available: !standalone,
    ready,
    sheetOpen: open,
    async install() {
      if (deferred) {
        await deferred.prompt();
        deferred = null;
        emit();
      } else {
        sheetOpen = true;
        emit();
      }
    },
    close() {
      sheetOpen = false;
      emit();
    },
  };
}

export function useRegisterSW() {
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {});
  }, []);
}

/** Manual install steps, for browsers without a one-tap install prompt (iPhone, Telegram, etc.). */
export function InstallSheet() {
  const i = useInstall();
  if (!i.sheetOpen) return null;
  const ios = isIOS();
  const steps = ios
    ? [
        { icon: Share, t: "Tap the Share button", d: "At the bottom of Safari." },
        { icon: SquarePlus, t: "Choose “Add to Home Screen”", d: "Then tap Add." },
      ]
    : [
        { icon: Globe, t: "Open this page in Chrome", d: "Apps like Telegram or Facebook can't install it." },
        { icon: SquarePlus, t: "Tap ⋮ then “Install app”", d: "Or “Add to Home screen”." },
      ];
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40" onClick={i.close}>
      <div className="dodo sheet-up w-full max-w-md rounded-t-[32px] px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-play text-2xl font-extrabold">Put Dodo on your phone</h2>
          <button aria-label="Close" onClick={i.close} className="grid size-10 place-items-center rounded-full bg-white"><X className="size-5" /></button>
        </div>
        <ol className="mt-5 space-y-3">
          {steps.map(({ icon: Icon, t, d }) => (
            <li key={t} className="dodo-card flex items-center gap-4 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lilac"><Icon className="size-5" /></span>
              <span><span className="block text-lg font-bold leading-tight">{t}</span><span className="text-sm opacity-70">{d}</span></span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
